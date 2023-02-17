/**
 * 介面縮減message為msg，但在此處與原本的error通用message
 */
class BasicError extends Error {
  constructor({
    code = 400,
    type = '',
    data = {},
    message = 'error happened',
  }) {
    super(message);
    this.code = code;
    this.type = type;
    this.data = data;
    this.message = message;
  }
}
module.exports = {
};
