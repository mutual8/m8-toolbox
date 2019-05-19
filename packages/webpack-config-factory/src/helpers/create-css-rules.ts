import { RuleSetRule, RuleSetUseItem } from 'webpack'

/**
 * The "CSS" loader resolves paths in CSS and adds assets as dependencies.
 */
function createCssLoader(options: {
  isClientConfig: boolean
  isDevConfig: boolean
  isModuleCss: boolean
}): RuleSetUseItem {
  const useCssLoader: {
    loader: string
    options: {
      importLoaders: 1
      localIdentName?: '[path]__[name]___[local]'
      minimize?: true
      modules?: boolean
    }
  } = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
    },
  }

  if (options.isModuleCss) {
    useCssLoader.options.localIdentName = '[path]__[name]___[local]'
    useCssLoader.options.modules = true
    if (!options.isClientConfig) {
      // On the server we do not need to embed the css and just want the identifier mappings
      // https://github.com/webpack-contrib/css-loader#scope
      useCssLoader.loader = require.resolve('css-loader/locals')
    }
  }

  if (options.isClientConfig && !options.isDevConfig) {
    useCssLoader.options.minimize = true
    if (!options.isModuleCss) {
      useCssLoader.options.modules = false
    }
  }

  return useCssLoader
}

/**
 * The "style" loader turns CSS into JS modules that inject <style> tags.
 *
 * In production, we use a plugin to extract CSS to a file, but in development
 * 'style-loader' enables hot editing of CSS.
 *
 * Note that getting the "style" loaders to work in Node.js requires too much
 * magic, fortunately we only need them for client-side rendered code.
 */
function createStyleLoader(options: { isDevConfig: boolean }): RuleSetUseItem {
  if (options.isDevConfig) {
    return require.resolve('style-loader')
  }

  /* eslint-disable global-require, @typescript-eslint/no-var-requires */
  const { loader } = require('mini-css-extract-plugin')
  /* eslint-enable global-require, @typescript-eslint/no-var-requires */

  return loader
}

function createPostCssLoader(): RuleSetUseItem {
  return {
    loader: require.resolve('postcss-loader'),
    options: {
      // https://webpack.js.org/guides/migrating/#complex-options
      ident: 'postcss',
      plugins: () => [
        /* eslint-disable global-require */
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: { flexbox: 'no-2009' },
          stage: 3,
        }),
        /* eslint-enable global-require */
      ],
    },
  }
}

/* eslint-disable global-require */
export function createCssRule(options: {
  buildFolder: string
  isClientConfig: boolean
  isDevConfig: boolean
  /**
   * Adds support for CSS Modules using the extension .module.css.
   *
   * @see https://github.com/css-modules/css-modules
   */
  isModuleCss: boolean
}): RuleSetRule {
  const { buildFolder, isClientConfig, isDevConfig, isModuleCss } = options

  const cssLoader = createCssLoader({
    isClientConfig,
    isDevConfig,
    isModuleCss,
  })

  return {
    test: isModuleCss ? /\.module\.css$/ : /\.css$/,
    exclude: isModuleCss ? [buildFolder] : [buildFolder, /\.module\.css$/],
    use: isClientConfig
      ? [createStyleLoader({ isDevConfig }), cssLoader, createPostCssLoader()]
      : [cssLoader],
  }
}
