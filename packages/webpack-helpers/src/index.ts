import { Compiler, Configuration, Plugin } from 'webpack'

import { PluginFunction, PluginOptions } from './conditional-plugin-factory'

// Export webpack types to so Mutual 8 modules do not need to depend on webpack directly.
export type WebpackCompiler = Compiler
export type WebpackConfiguration = Configuration
export type WebpackPlugin = Plugin
export type WebpackPluginFunction<T> = PluginFunction<T>
export type WebpackPluginOptions<T> = PluginOptions<T>

export { createConditionalWebpackPlugin } from './conditional-plugin-factory'
export { HotModuleReplacementPlugin } from './plugins/hot-module-replacement'
