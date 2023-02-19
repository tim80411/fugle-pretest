const { createServer } = require('http');

const logger = require('lib/basic/Logger');
const app = require('server/main/express');

class ApiServer {
  constructor(port) {
    this.port = port;
    this.app = app;
    this.server = null;

    this.setEventHandler();
    this.createServer();
  }

  createServer() {
    // const server = this.app.listen(this.port, () => {
    //   logger.info({ msg: `Start listen on port: ${this.port}` });
    // });
    // this.server = server;

    this.server = createServer(app);
    this.server.listen(this.port, () => {
      logger.info({ msg: `Start listen on port: ${this.port}` });
    });
  }

  setEventHandler() {
    logger.info('Set server event handler');
    this.app.on('error', (err) => {
      logger.error({ msg: 'Express app error:', err });
    });
  }
}

module.exports = ApiServer;
