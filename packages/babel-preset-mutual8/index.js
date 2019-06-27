const DEFAULT_PRESETS = [
  [require.resolve('@babel/preset-env'), { modules: false }],
  require.resolve('@babel/preset-react'),
]

const DEFAULT_PLUGINS = [
  // class { handleThing = () => { } }
  require.resolve('@babel/plugin-proposal-class-properties'),

  // The following two plugins use Object.assign directly, instead of Babel's
  // extends helper. Note that this assumes `Object.assign` is available.
  // { ...todo, completed: true }
  [
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    {
      useBuiltIns: true,
    },
  ],
  // Adds syntax support for import()
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  // Add support for async/await
  require.resolve('@babel/plugin-transform-runtime'),
]

function babelPresetMutual8() {
  const MODE = process.env.BABEL_ENV || process.env.NODE_ENV

  switch (MODE) {
    case 'development': {
      return {
        presets: [
          ...DEFAULT_PRESETS,
          // Adds component stack to warning messages
          require.resolve('@babel/plugin-transform-react-jsx-source'),
        ],
        plugins: DEFAULT_PLUGINS,
      }
    }

    case 'production': {
      return {
        presets: [
          ...DEFAULT_PRESETS,
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
        ],
        plugins: DEFAULT_PLUGINS,
      }
    }

    case 'test': {
      return {
        presets: [
          ...DEFAULT_PRESETS,
          // Adds component stack to warning messages
          require.resolve('@babel/plugin-transform-react-jsx-source'),
          // Compiles import() to a deferred require()
          require.resolve('babel-plugin-dynamic-import-node'),
          // Transform ES modules to commonjs for Jest support
          [
            require.resolve('@babel/plugin-transform-modules-commonjs'),
            { loose: true },
          ],
        ],
        plugins: DEFAULT_PLUGINS,
      }
    }

    default: {
      throw new Error(
        `Using ${'`babel-preset-mutual8`'} requires that you specify ` +
          `${'`NODE_ENV`'} or ${'`BABEL_ENV`'} environment variables.\n` +
          `Valid values are "development", "test", and "production".` +
          `${MODE ? `\nInstead, received: ${JSON.stringify(MODE)}.` : ''}`
      )
    }
  }
}

module.exports = babelPresetMutual8
