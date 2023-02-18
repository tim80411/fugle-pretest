// middleware 不同層的error handling需要各自處理
const data = require('./data');

function initRoute(app) {
  app.use('/data', data);
}

module.exports = initRoute;
