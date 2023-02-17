class Utility {
  /**
   * for detect and ignore circular reference
   * @param {Object} obj obj
   * @returns {String} stringifyObj
   */
  static stringify(obj) {
    const cache = new Set();

    function handler(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return;
        }
        cache.add(value);
      }
      return value;
    }

    const str = JSON.stringify(obj, handler);
    cache.clear();
    return str;
  }
}

module.exports = Utility;
