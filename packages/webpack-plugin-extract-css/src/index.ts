import {
  createConditionalWebpackPlugin,
  MiniCssExtractPlugin,
} from '@mutual8/webpack-helpers'

/**
 * This plugin extract CSS into separate files.
 */
export default createConditionalWebpackPlugin(compiler => {
  const plugin = new MiniCssExtractPlugin({
    filename: 'static/css/bundle.[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  })

  plugin.apply(compiler)
})
