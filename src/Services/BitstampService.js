const _ = require('lodash');
const moment = require('moment');

const logger = require('lib/basic/Logger');
const redis = require('src/db/redis/entry');

class BistampService {
  static #getExistPrice(currPrice, prevPrice) {
    return currPrice || prevPrice;
  }

  static getOHLC(strTickers) {
    const tickers = strTickers.map((item) => JSON.parse(item));
    const defaultValue = {
      inMinute: {
        oldestPrice: 0,
        latestPrice: 0,
        highestPrice: 0,
        lowestPrice: 0,
      },
    };

    const ret = tickers.reduce((prev, curr, index, array) => {
      const currPrice = curr.price;
      const {
        latestPrice, highestPrice, oldestPrice, lowestPrice,
      } = prev.inMinute;

      if (index === 0) prev.inMinute.oldestPrice = this.#getExistPrice(currPrice, oldestPrice);
      if (index === array.length - 1) prev.inMinute.latestPrice = this.#getExistPrice(currPrice, latestPrice);
      if (currPrice > highestPrice) prev.inMinute.highestPrice = this.#getExistPrice(currPrice, highestPrice);
      if (currPrice < lowestPrice || lowestPrice === 0) prev.inMinute.lowestPrice = this.#getExistPrice(currPrice, lowestPrice);

      return prev;
    }, defaultValue);

    return ret;
  }

  static async handleTicker({ server, channel, ticker }) {
    if (!channel) return;
    if (_.isEmpty(ticker)) return;

    const pair = _.trimStart(channel, 'live_trades');
    const clients = server.subscriptions.get(pair);

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
  }
}

module.exports = BistampService;
