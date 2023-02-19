const Websocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const moment = require('moment');

const config = require('config/entry');
const logger = require('lib/basic/Logger');
const Utility = require('lib/Utility');
const redis = require('src/db/redis/entry');
const WsService = require('src/Services/WsService');
const BistampService = require('src/Services/BitstampService');

class WsServer {
  constructor() {
    this.server = null;
    this.bitStampConnection = null;
    this.clients = new Map();
    this.subscriptions = new Map();

    this.createServer();
    this.createBitStampConnection();
    this.bindServerEvent();
    this.bindConnectionEvent();
  }

  createServer() {
    this.server = new Websocket.WebSocketServer(config.ws.serverConfig);
  }

  createBitStampConnection() {
    this.bitStampConnection = new Websocket(config.address.bitStamp);
  }

  bindConnectionEvent() {
    // message
    this.bitStampConnection.on('message', async (data) => {
      const parseData = data.toString();
      logger.debug({ msg: 'Client Receive data', parseData });
      if (!Utility.isJSON(parseData)) return;

      // 取得回傳的type
      const jsonData = JSON.parse(parseData);
      const { data: ticker, channel } = jsonData;
      if (!channel) return;
      if (_.isEmpty(ticker)) return;

      const pair = _.trimStart(channel, 'live_trades');
      const clients = this.subscriptions.get(pair);

      if (_.isEmpty(clients)) return;

      const now = moment().valueOf();
      const minuteAgo = moment().subtract(1, 'minute').valueOf();

      // get minute range data and combine with OHLC info
      await redis.zadd(pair, now, JSON.stringify(ticker));
      const strTickers = await redis.zrangebyscore(pair, minuteAgo, now);
      logger.debug({ msg: 'Get range tickers', strTickers });
      redis.zremrangebyscore(pair, '-inf', minuteAgo);
      const OHLC = BistampService.getOHLC(strTickers);
      const finalData = {
        ...ticker,
        ...OHLC,
      };
      clients.forEach((client) => {
        client.send(JSON.stringify(finalData));
      });
    });

    // open
    this.bitStampConnection.on('open', () => {
      logger.debug({ msg: 'Connection to bitStamp open' });
    });
  }

  bindServerEvent() {
    this.server.on('connection', (ws) => {
      const clientId = `ws-${uuidv4()}`;
      const connectionCount = this.server.clients.size;
      logger.debug({ msg: 'Got a connection', connectionCount, clientId });

      // maintain clientId
      this.clients.set(clientId, ws);
      ws.uniqClientId = clientId;

      ws.on('message', (data) => {
        const parseData = data.toString();
        logger.debug({ msg: 'Server Receive data', parseData });
        if (!Utility.isJSON(parseData)) return;

        // main
        const jsonData = JSON.parse(parseData);
        const { type, channel: pair } = jsonData;
        if (type === 'subscribe') {
          const sendData = {
            event: 'bts:subscribe',
            data: {
              channel: `live_trades_${pair}`,
            },
          };

          // add subscribers
          if (this.subscriptions.has(pair)) {
            const pairSubscribers = this.subscriptions.get(pair);
            pairSubscribers.push(ws);
            this.subscriptions.set(pair, pairSubscribers);
          } else {
            this.subscriptions.set(pair, [ws]);
          }

          this.bitStampConnection.send(JSON.stringify(sendData));
          ws.send(`Success subscribe: ${pair}`);
        }

        if (type === 'unsubscribe') {
          WsService.unsubscribe({
            server: this, ws, pair, clientId,
          });

          // TODO: when subscriber empty, unsubscribe pair ticker of bitstamp
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        WsService.unsubscribeAll({ server: this, ws, clientId });
        logger.debug({ msg: 'Close a connection', connectionCount, clientId });
      });
    });
  }
}

module.exports = WsServer;
