import {
  HotModuleReplacementPlugin as WebpackHotModuleReplacementPlugin,
  Plugin as WebpackPlugin,
} from 'webpack'

/**
 * Enables Hot Module Replacement, otherwise known as HMR.
 *
 * Generates Hot Update Chunks of each chunk in the records, enables the HMR
 * API, and makes __webpack_hash__ available in the bundle.
 *
 * Note that:
 * - Hot Module Replacement should never be used in production
 * - the plugin options are experimental, may be deprecated, and are in most
 *   cases not necessary
 * - requires records data if not in `dev-server` mode
 *
 * @see https://webpack.js.org/plugins/hot-module-replacement-plugin
 */
export const HotModuleReplacementPlugin: new (options?: {
  /**
   * Optional, if set to `true`, the plugin will build in two steps -- first
   * compiling the hot update chunks, and then the remaining normal assets.
   *
   * @default false
   */
  multiStep?: boolean

  /**
   * Optional delay, in milliseconds, between the two steps when
   * `multiStep` is enabled. Defaults to `200` milliseconds.
   *
   * @default 200
   */
  fullBuildTimeout?: number

  /**
   * Optional timeout, in milliseconds, used for manifest download.
   * Defaults to `10000` milliseconds.
   *
   * @default 10000
   */
  requestTimeout?: number
}) => WebpackPlugin = WebpackHotModuleReplacementPlugin
