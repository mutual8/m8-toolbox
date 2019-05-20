import {
  AggressiveMergingPlugin,
  createConditionalWebpackPlugin,
} from '@mutual8/webpack-helpers'

export default createConditionalWebpackPlugin(compiler => {
  const plugin = new AggressiveMergingPlugin()

  plugin.apply(compiler)
})
