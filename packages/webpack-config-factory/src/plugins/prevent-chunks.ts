import { optimize } from 'webpack'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const PreventChunksPlugin = createConditionalWebpackPlugin(compiler => {
  const plugin = new optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  plugin.apply(compiler)
})

export default PreventChunksPlugin
