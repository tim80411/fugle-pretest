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
}

module.exports = BistampService;
