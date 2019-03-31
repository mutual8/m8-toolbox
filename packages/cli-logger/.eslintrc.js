const { rules = {}, ...config } = require('../../.eslintrc')

module.exports = {
  ...config,
  rules: {
    ...rules,
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
