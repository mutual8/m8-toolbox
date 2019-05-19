import { HashedModuleIdsPlugin } from 'webpack'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const AggressiveMergingPlugin = createConditionalWebpackPlugin(compiler => {
  const plugin = new HashedModuleIdsPlugin()
  plugin.apply(compiler)
})

export default AggressiveMergingPlugin
