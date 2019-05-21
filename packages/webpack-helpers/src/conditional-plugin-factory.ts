import { Compiler as WebpackCompiler, Plugin as WebpackPlugin } from 'webpack'

export type PluginOptions<T> = { enablePlugin: boolean } & T

export type PluginFunction<T> = (
  compiler: WebpackCompiler,
  options: PluginOptions<T>
) => void

export function createConditionalWebpackPlugin<T = {}>(
  pluginFunction: PluginFunction<T>
): (new (options: PluginOptions<T>) => WebpackPlugin) & WebpackPlugin {
  return class Plugin {
    private options: PluginOptions<T>

    public constructor(options: PluginOptions<T>) {
      this.apply.bind(this)
      this.options = options
    }

    public apply(compiler: WebpackCompiler): void {
      if (!this.options || typeof pluginFunction !== 'function') {
        return
      }

      if (this.options.enablePlugin) {
        pluginFunction(compiler, this.options)
      }
    }
  }
}
