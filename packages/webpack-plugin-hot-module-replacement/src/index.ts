import {
  createConditionalWebpackPlugin,
  HotModuleReplacementPlugin,
  WebpackConfiguration,
} from '@mutual8/webpack-helpers'

export default createConditionalWebpackPlugin<{
  target?: WebpackConfiguration['target']
}>((compiler, { target = compiler.options.target }) => {
  const pluginOptions = target === 'web' ? { multiStep: true } : undefined

  const plugin = new HotModuleReplacementPlugin(pluginOptions)

  plugin.apply(compiler)
})
