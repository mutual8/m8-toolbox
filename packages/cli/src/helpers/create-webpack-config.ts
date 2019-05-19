import { join as joinPath } from 'path'
import StartServerPlugin from 'start-server-webpack-plugin'
import * as wp from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'

type WebpackConfig = wp.Configuration
type Plugin = wp.Plugin
type CreatePlugin = () => Plugin
type EnvVars = Record<string, string>
interface WebpackConfigOptions {
  IS_DEV_CONFIG: boolean
  ENV_VARS: EnvVars
  BUILD_FOLDER: string
}
type Create<T extends WebpackConfigOptions> = (options: T) => WebpackConfig
type CreateConfig = Create<WebpackConfigOptions & { isServer: boolean }>

// Export separate (more future-proof) type names for client and server config.
export type WebpackConfigOptionsForClientSideCode = WebpackConfigOptions
export type WebpackConfigOptionsForServerSideCode = WebpackConfigOptions
export type CreateWebpackConfigForClientSideCode = Create<
  WebpackConfigOptionsForClientSideCode
>
export type CreateWebpackConfigForServerSideCode = Create<
  WebpackConfigOptionsForServerSideCode
>

const definePlugin = (envVars: EnvVars): CreatePlugin => (): Plugin =>
  new wp.DefinePlugin(envVars)

const hotModuleReplacementPlugin = (): Plugin =>
  new wp.HotModuleReplacementPlugin({ multiStep: true })

const limitChunkCountPlugin = (): Plugin =>
  new wp.optimize.LimitChunkCountPlugin({ maxChunks: 1 })

const manifestPlugin = (): Plugin =>
  new ManifestPlugin({
    fileName: 'manifest.json',
    writeToFileEmit: true,
  })

const startServerPlugin = (): Plugin => {
  const nodeArgs = ['-r', 'source-map-support/register']

  // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
  if (process.env.INSPECT_BRK) {
    nodeArgs.push(process.env.INSPECT_BRK)
  } else if (process.env.INSPECT) {
    nodeArgs.push(process.env.INSPECT)
  }

  return new StartServerPlugin({ name: 'server.js', nodeArgs })
}

const watchIgnoreManifestPlugin = (
  folder: string
): CreatePlugin => (): Plugin =>
  new wp.WatchIgnorePlugin([joinPath(folder, 'manifest.json')])

const reducePlugins = (plugins: [string, boolean, CreatePlugin][]): Plugin[] =>
  plugins
    .filter(([, needsPlugin]): boolean => needsPlugin)
    .map(([, , createPlugin]): Plugin => createPlugin())

const createConfig: CreateConfig = ({
  IS_DEV_CONFIG,
  ENV_VARS,
  BUILD_FOLDER,
  isServer,
}): WebpackConfig => {
  const isDevServer = isServer && IS_DEV_CONFIG
  // const isProdServer = !isDevServer
  const isClient = !isServer
  const isDevClient = isClient && IS_DEV_CONFIG
  // const isProdClient = !isDevClient

  const entry: wp.Entry = {}
  const mode = IS_DEV_CONFIG ? 'development' : 'production'
  const target = isServer ? 'node' : 'web'

  // Verbose code allows (future!) declarative adding / altering of plugins:
  // @todo convert tp proper Map() and add API, something like:
  // * addPlugin(id, condition, () => new Plugin())
  // * addPlugins([[id, condition, () => new Plugin()]])
  // * filterPlugins((id) => id !== 'something')
  // * mapPlugins((id, condition, factory) => [id, condition, factory])
  // * alterPlugins(plugins => [...plugins])
  const plugins = reducePlugins([
    // Define globally available environment variables.
    ['env-vars-server', isServer, definePlugin(ENV_VARS)],
    // Define globally available environment variables.
    ['limit-chunks-server', isServer, limitChunkCountPlugin],
    // Add hot module replacement.
    ['hmr-server', isDevServer, hotModuleReplacementPlugin],
    // Restart server.
    ['restart-webserver', isDevServer, startServerPlugin],
    // Ignore the manifest file to avoid infinite recompilation.
    ['ignore-manifest', isDevServer, watchIgnoreManifestPlugin(BUILD_FOLDER)],
    // Output JS and CSS files in a manifest file in the build directory.
    ['create-manifest', isClient, manifestPlugin],
    // Add hot module replacement.
    ['hmr-client', isDevClient, hotModuleReplacementPlugin],
    // Define globally available environment variables.
    ['env-vars-client', isDevClient, definePlugin(ENV_VARS)],
  ])

  return {
    entry,
    target,
    mode,
    plugins,
  }
}

/**
 * Generates Webpack configuration for client-side code.
 */
export const createClientConfig: CreateWebpackConfigForClientSideCode = (
  options
): WebpackConfig =>
  createConfig({
    ...options,
    isServer: false,
  })

/**
 * Generates Webpack configuration for server-side-rendering code.
 */
export const createServerConfig: CreateWebpackConfigForServerSideCode = (
  options
): WebpackConfig =>
  createConfig({
    ...options,
    isServer: true,
  })
