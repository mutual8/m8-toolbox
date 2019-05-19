import { HotModuleReplacementPlugin } from 'webpack'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const HmrPlugin = createConditionalWebpackPlugin(compiler => {
  const multiStep = compiler.options.target === 'web'
  const plugin = new HotModuleReplacementPlugin({ multiStep })
  plugin.apply(compiler)
})

export default HmrPlugin
