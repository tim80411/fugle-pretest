const logger = require('lib/basic/Logger');
const WsService = require('src/Services/WsService');

class MessageStrategy {
  constructor({
    server, ws, pair, type, clientId,
  }) {
    this.server = server;
    this.ws = ws;
    this.pair = pair;
    this.type = type;
    this.clientId = clientId;
  }

  process() {
    const self = this;

    const func = self[self.type];
    logger.info({ msg: 'Ready to process strategy', type: this.type });
    if (!func) {
      logger.debug({ mgs: 'Without matched strategy' });
      return;
    }

    func.apply(self);
  }

  // main
  // 請以type作為方法的命名
  subscribe() {
    const self = this;
    const {
      server, ws, pair, clientId,
    } = self;
    const sendData = {
      event: 'bts:subscribe',
      data: {
        channel: `live_trades_${self.pair}`,
      },
    };
    // add subscribers
    WsService.subScribe({
      server, ws, pair, clientId,
    });

    server.bitStampConnection.send(JSON.stringify(sendData));
    ws.send(`Success subscribe: ${pair}`);
  }

  unsubscribe() {
    const {
      server, ws, pair, clientId,
    } = this;
    WsService.unsubscribe({
      server, ws, pair, clientId,
    });
  }
}

module.exports = MessageStrategy;
