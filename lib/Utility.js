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

  static isJSON(str) {
    try {
      const parse = JSON.parse(str);
      if (parse && typeof parse === 'object') {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

module.exports = Utility;
