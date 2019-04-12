const rootConfig = require('../../.eslintrc')

const rules = {
  ...rootConfig.rules,
  'no-console': 'off',
}

module.exports = { ...rootConfig, rules }
