import { optimize } from 'webpack'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const AggressiveMergingPlugin = createConditionalWebpackPlugin(compiler => {
  const plugin = new optimize.AggressiveMergingPlugin()
  plugin.apply(compiler)
})

export default AggressiveMergingPlugin
