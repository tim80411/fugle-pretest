const Websocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const config = require('config/entry');
const logger = require('lib/basic/Logger');
const Utility = require('lib/Utility');
const WsService = require('src/Services/WsService');
const BistampService = require('src/Services/BitstampService');
const ServerMessageStrategy = require('src/events/server/MessageStrategy');

class WsServer {
  constructor(apiServer) {
    this.server = null;
    this.bitStampConnection = null;
    this.clients = new Map();
    this.subscriptions = new Map();
    this.apiServer = apiServer;

    this.createServer();
    this.createBitStampConnection();
    this.bindServerEvent();
    this.bindConnectionEvent();
  }

  createServer() {
    this.server = new Websocket.WebSocketServer({ server: this.apiServer });
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

      await BistampService.handleTicker({ server: this, channel, ticker });
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
        const self = this;
        const parseData = data.toString();
        logger.debug({ msg: 'Server Receive data', parseData });
        if (!Utility.isJSON(parseData)) return;

        // main
        const jsonData = JSON.parse(parseData);
        const { type, channel: pair } = jsonData;

        const strategy = new ServerMessageStrategy({
          server: self, ws, pair, type, clientId,
        });
        strategy.process();
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
