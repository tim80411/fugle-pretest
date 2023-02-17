const dev = require('config/dev');
const defaultSetting = require('config/default');

const configMapping = {
  dev,
};

const envConfig = configMapping[process.env.NODE_ENV] || dev;

const finalSetting = {
  ...defaultSetting,
  ...envConfig,
};

module.exports = finalSetting;
