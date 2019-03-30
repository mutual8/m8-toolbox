module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'prettier', 'prettier/@typescript-eslint'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
  },
  env: {
    browser: false,
    commonjs: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: {
        // Allow import and resolve for *.ts modules.
        extensions: ['.js', '.ts'],
      },
    },
  },
}
