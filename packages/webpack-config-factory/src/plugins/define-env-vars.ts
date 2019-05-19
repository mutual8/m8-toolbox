import { DefinePlugin } from 'webpack'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const DefineEnvVarsPlugin = createConditionalWebpackPlugin<{
  stringifiedEnvVars: Record<string, string>
}>((compiler, { stringifiedEnvVars }) => {
  const plugin = new DefinePlugin(stringifiedEnvVars)
  plugin.apply(compiler)
})

export default DefineEnvVarsPlugin
