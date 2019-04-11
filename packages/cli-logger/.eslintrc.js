const { rules = {}, ...config } = require('../../.eslintrc')

module.exports = {
  ...config,
  rules: {
    ...rules,
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
