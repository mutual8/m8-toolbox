import { Configuration } from 'webpack'

import { createCssRule } from './helpers/create-css-rules'
import { getNodePathArray } from './helpers/get-node-path-array'
import AggressiveMergingPlugin from './plugins/aggressive-merging'
import DefineEnvVarsPlugin from './plugins/define-env-vars'
import ExtractCssPlugin from './plugins/extract-css'
import HashedModuleIdsPlugin from './plugins/hashed-module-ids'
import HmrPlugin from './plugins/hmr'
import ManifestPlugin from './plugins/manifest'
import PreventChunksPlugin from './plugins/prevent-chunks'
import ProgressBarPlugin from './plugins/progress-bar'
import StartWebserverPlugin from './plugins/start-webserver'

export interface WebpackConfigPaths {
  app: {
    buildFolder: string
    clientIndexFile: string
    nodeModulesFolder: string
    serverIndexFile: string
    srcFolder: string
  }
  cli: {
    nodeModulesFolder: string
  }
}

interface WebpackConfigOptions {
  cwd?: string
  isDevConfig: boolean
  paths: WebpackConfigPaths
  target: 'client' | 'server'
  stringifiedEnvVars: Record<string, string>
  withTypescript?: boolean
  withEmotion?: boolean
}

const babelOptions = {}

function createMutual8Config(options: WebpackConfigOptions): Configuration {
  const {
    cwd = process.cwd(),
    isDevConfig,
    stringifiedEnvVars,
    target,
  } = options
  const isClientConfig = target === 'client'
  const { nodeModulesFolder: cliNodeModulesFolder } = options.paths.cli
  const {
    buildFolder,
    nodeModulesFolder: appNodeModulesFolder,
    srcFolder,
  } = options.paths.app
  const indexFile = isClientConfig
    ? options.paths.app.clientIndexFile
    : options.paths.app.serverIndexFile

  return {
    mode: isDevConfig ? 'development' : 'production',

    context: cwd,

    target: isClientConfig ? 'web' : 'node',

    devtool: isDevConfig ? 'cheap-module-source-map' : 'source-map',

    resolve: {
      modules: ['node_modules', appNodeModulesFolder, ...getNodePathArray()],
      extensions: ['.mjs', '.jsx', '.js', '.json'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        'react-native': 'react-native-web',
      },
    },

    resolveLoader: { modules: [appNodeModulesFolder, cliNodeModulesFolder] },

    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        // { parser: { requireEnsure: false } },
        // Avoid "require is not defined" errors
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        // Transform ES6 with Babel
        {
          test: /\.(js|jsx|mjs)$/,
          include: [srcFolder],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
          ],
        },
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx|mjs)$/,
            /\.(ts|tsx)$/,
            /\.(vue)$/,
            /\.(less)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.json$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: isClientConfig,
          },
        },
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: isClientConfig,
          },
        },
        createCssRule({
          isModuleCss: false,
          buildFolder,
          isDevConfig,
          isClientConfig,
        }),
        createCssRule({
          isModuleCss: true,
          buildFolder,
          isDevConfig,
          isClientConfig,
        }),
      ],
    },

    entry: () => {
      const hotDevClient = require.resolve('../scripts/hot-dev-client')
      const hotPoll = 'webpack/hot/poll?300'
      const devEntries = isClientConfig
        ? [hotDevClient]
        : [hotDevClient, hotPoll]
      const entry = isDevConfig ? [...devEntries, indexFile] : indexFile

      return isClientConfig ? { client: entry } : entry
    },

    plugins: [
      new AggressiveMergingPlugin({
        enablePlugin: !isDevConfig && isClientConfig,
      }),
      new DefineEnvVarsPlugin({
        enablePlugin: true,
        stringifiedEnvVars,
      }),
      new ExtractCssPlugin({
        enablePlugin: !isDevConfig && isClientConfig,
      }),
      new HashedModuleIdsPlugin({
        enablePlugin: !isDevConfig && isClientConfig,
      }),
      new HmrPlugin({
        // Enable hot module replacement during development only.
        enablePlugin: isDevConfig,
      }),
      new ManifestPlugin({
        // Always enabled. Plugin checks target and mode itself.
        enablePlugin: true,
        buildFolder,
      }),
      new PreventChunksPlugin({
        // Prevent chunks for server.
        enablePlugin: !isClientConfig,
      }),
      new ProgressBarPlugin({
        // Enable progress bar during development only.
        enablePlugin: isDevConfig,
        name: target,
        color: isClientConfig ? '#ff764d' : '#6688f4',
      }),
      new StartWebserverPlugin({
        enablePlugin: isClientConfig && isDevConfig,
      }),
    ],
  }
}

export default createMutual8Config
