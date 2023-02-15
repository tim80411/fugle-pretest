/* eslint-disable import/no-extraneous-dependencies, global-require */
const pino = require('pino');

// 為了兼容vscode debugger時也能使用pino-pretty特別做的處理; pino-pretty不建議使用於prod環境
const pinoParams = [
  {
    level: 'trace',
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
  },
];
if (process.env.NODE_ENV === 'dev') {
  const pretty = require('pino-pretty');
  // @ts-ignore
  const stream = pretty({
    colorize: true,
  });

  pinoParams.push(stream);
}

/**
 * pino document: https://github.com/pinojs/pino/blob/HEAD/docs/api.md
 */
// @ts-ignore
const Logger = pino(...pinoParams);

module.exports = Logger;
