import { Compiler, Plugin } from 'webpack'

type PluginOptions<T> = { enablePlugin: boolean } & T
type PluginFunction<T> = (compiler: Compiler, options: PluginOptions<T>) => void

export function createConditionalWebpackPlugin<T = {}>(
  pluginFunction: PluginFunction<T>
): (new (options: PluginOptions<T>) => Plugin) & Plugin {
  return class WebpackPlugin {
    private options: PluginOptions<T>

    public constructor(options: PluginOptions<T>) {
      this.options = options
    }

    public apply(compiler: Compiler): void {
      if (this.options.enablePlugin) {
        pluginFunction(compiler, this.options)
      }
    }
  }
}
