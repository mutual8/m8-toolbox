import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const pluginOptions: MiniCssExtractPlugin.PluginOptions & {
  allChunks: true
} = {
  filename: 'static/css/bundle.[contenthash:8].css',
  chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  // allChunks: true because we want all css to be included in the main
  // css bundle when doing code splitting to avoid FOUC:
  // https://github.com/facebook/create-react-app/issues/2415
  allChunks: true,
}

const ExtractCssPlugin = createConditionalWebpackPlugin(compiler => {
  const plugin = new MiniCssExtractPlugin(pluginOptions)
  plugin.apply(compiler)
})

export default ExtractCssPlugin
