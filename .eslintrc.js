module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
  extends: 'airbnb-base',
  rules: {
    'max-classes-per-file': 'off',
    'max-len': ['error', { code: 140, ignoreComments: true }],
    'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
    'consistent-return': 'off',
  },
  settings: { // 設定require時能判斷path起始是由哪裡開始
    'import/resolver': {
      node: {
        paths: ['.'],
      },
    },
  },
};
