import WebpackbarPlugin from 'webpackbar'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const ProgressBarPlugin = createConditionalWebpackPlugin<{
  name: string
  color: string
}>((compiler, { color, name }) => {
  const plugin = new WebpackbarPlugin({ color, name })
  plugin.apply(compiler)
})

export default ProgressBarPlugin
