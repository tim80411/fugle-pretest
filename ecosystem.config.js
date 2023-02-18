const logger = require('lib/basic/Logger');

const appDefs = {
  dev: {
    suffix: 'dev',
    node_args: ['--inspect=9331'],
  },
};

const def = appDefs[process.env.NODE_ENV || 'dev'];
logger.info({ msg: 'pm2 definition', def });

// pm2 api doc: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps: [
    {
      name: `${def.suffix}-app`,
      script: './index.js',
      ignore_watch: ['node_modules', '*.md'],
      env: {
        NODE_PATH: '.',
      },
      watch: true,
      autorestart: true,
      merge_logs: true,
      node_args: def.node_args,
    },
  ],
};
