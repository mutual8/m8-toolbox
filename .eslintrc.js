module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
  },
  env: {
    browser: false,
    commonjs: true,
    es6: true,
    jest: false,
  },
  settings: {
    'import/resolver': {
      node: {
        // Allow import and resolve for *.ts modules.
        extensions: ['.js', '.ts'],
      },
    },
  },
  overrides: [
    {
      files: [
        '**/*.spec.js',
        '**/*.test.js',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.test.tsx',
      ],
      env: { jest: true },
      rules: {
        'import/no-extraneous-dependencies': ['off', { devDependencies: true }],
      },
    },
  ],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
