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

/**
 * 當參數不合規範時
 */
class InvalidValueError extends BasicError {
  constructor({
    msg = 'Invalid value',
    data = {},
  }) {
    super({
      code: 409,
      type: 'InvalidValue',
      data,
      message: msg,
    });
  }
}

class SystemError extends BasicError {
  constructor({
    msg = 'System error',
    data = {},
  }) {
    super({
      code: 500,
      data,
      message: msg,
      type: 'SystemError',
    });
  }
}

module.exports = {
  InvalidValueError,
  SystemError,
};
