const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const WsServer = require('server/ws/wsServer');

const ErrorLib = require('lib/basic/ErrorLib');
const logger = require('lib/basic/Logger');

class WsService {
  /**
   * 取消訂閱
   * @param {Object} param root
   * @param {WsServer} param.server WsServer
   * @param {Object} param.ws ws connection to client
   * @param {String} param.pair bitstamp pair, [ref](https://www.bitstamp.net/websocket/v2/)
   * @param {String} param.clientId uuid with prefix `ws`
   * @returns {void}
   */
  static unsubscribe({
    server, ws, pair, clientId,
  }) {
    if (!server.subscriptions.has(pair)) return;
    if (!clientId) throw new ErrorLib.SystemError({ data: { functionName: this.unsubscribe.name } });

    const pairSubscribers = server.subscriptions.get(pair);
    _.remove(pairSubscribers, (item) => item.uniqClientId === clientId);

    server.subscriptions.set(pair, pairSubscribers);
    ws.send(`Success unsubscribe: ${pair}`);
    logger.info({ msg: 'Success unsubscribe', pair });
  }

  /**
   * 取消訂閱全部
   * @param {Object} param root
   * @param {WsServer} param.server WsServer
   * @param {Object} param.ws ws connection to client
   * @param {String} param.clientId uuid with prefix `ws`
   */
  static unsubscribeAll({ server, ws, clientId }) {
    const subs = server.subscriptions.keys();
    for (const sub of subs) {
      this.unsubscribe({
        server, ws, pair: sub, clientId,
      });
    }
  }

  /**
   * 訂閱
   * @param {Object} param root
   * @param {WsServer} param.server WsServer
   * @param {Object} param.ws ws connection to client
   * @param {String} param.pair bitstamp pair, [ref](https://www.bitstamp.net/websocket/v2/)
   * @param {String} param.clientId uuid with prefix `ws`
   */
  static subScribe({
    server, ws, pair, clientId,
  }) {
    if (!server.subscriptions.has(pair)) {
      server.subscriptions.set(pair, [ws]);
      return;
    }

    const pairSubscribers = server.subscriptions.get(pair);
    const isWsExists = pairSubscribers.some((item) => item.uniqClientId === clientId);
    if (isWsExists) return;

    pairSubscribers.push(ws);
    server.subscriptions.set(pair, pairSubscribers);
  }
}

module.exports = WsService;
