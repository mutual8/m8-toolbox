const { rules = {}, ...config } = require('../../.eslintrc')

module.exports = {
  ...config,
  rules: {
    ...rules,
    'no-console': 'off',
  },
}
