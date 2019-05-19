import path from 'path'
import { WatchIgnorePlugin } from 'webpack'
import WebpackManifestPlugin from 'webpack-manifest-plugin'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const ManifestPlugin = createConditionalWebpackPlugin<{
  buildFolder: string
  /**
   * The manifest filename in your output directory.
   *
   * Default: 'manifest.json'
   */
  manifestFileName?: string
}>((compiler, { buildFolder, manifestFileName = 'manifest.json' }) => {
  const { mode, target } = compiler.options

  if (target === 'web') {
    const pluginOptions: WebpackManifestPlugin.Options = {
      basePath: buildFolder,
      writeToFileEmit: true,
      fileName: manifestFileName,
    }
    const plugin = new WebpackManifestPlugin(pluginOptions)
    plugin.apply(compiler)
  }

  if (mode === 'development' && target === 'node') {
    const pluginOptions = [path.join(buildFolder, manifestFileName)]
    const plugin = new WatchIgnorePlugin(pluginOptions)
    plugin.apply(compiler)
  }
})

export default ManifestPlugin
