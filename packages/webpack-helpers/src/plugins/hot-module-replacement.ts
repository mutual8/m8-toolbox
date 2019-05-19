import {
  HotModuleReplacementPlugin as WebpackHotModuleReplacementPlugin,
  Plugin as WebpackPlugin,
} from 'webpack'

/**
 * Enables Hot Module Replacement, otherwise known as HMR.
 *
 * Note that:
 * - HMR should never be used in production
 * - the plugin options are experimental and may be deprecated
 * - in most cases no options are necessary
 *
 * @see https://webpack.js.org/plugins/hot-module-replacement-plugin
 */
export const HotModuleReplacementPlugin: new (options?: {
  /**
   * Optional, if set to true, the plugin will build in two steps -- first
   * compiling the hot update chunks, and then the remaining normal assets.
   */
  multiStep?: boolean
  /**
   * Optional delay between the two steps (ignored unless multiStep === true).
   */
  fullBuildTimeout?: number
  /**
   * Optional timeout used for manifest download.
   */
  requestTimeout?: number
}) => WebpackPlugin = WebpackHotModuleReplacementPlugin
