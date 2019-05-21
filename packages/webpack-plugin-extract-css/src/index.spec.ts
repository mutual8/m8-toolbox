import * as helpers from '@mutual8/webpack-helpers'

import Plugin from '.'

const {
  $mockedMiniCssExtractPluginApply,
  MiniCssExtractPlugin,
} = helpers as any

const OPTIONS: any = { pluginOptions: 'pluginOptions' }
const COMPILER: any = { compiler: 'compilerOptions' }

test('when created but NOT applied, does NOT create MiniCssExtractPlugin instance', () => {
  const pluginFn = new Plugin(OPTIONS)

  expect(MiniCssExtractPlugin).not.toHaveBeenCalled()
  expect($mockedMiniCssExtractPluginApply).not.toHaveBeenCalled()
})

test('when applied, creates MiniCssExtractPlugin instance with correct options', () => {
  const pluginFn = new Plugin(OPTIONS)
  pluginFn.apply(COMPILER)

  expect(MiniCssExtractPlugin).toHaveBeenCalledTimes(1)
  expect(MiniCssExtractPlugin).toHaveBeenCalledWith({
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    filename: 'static/css/bundle.[contenthash:8].css',
  })
})

test('when applied, applies MiniCssExtractPlugin', () => {
  const pluginFn = new Plugin(OPTIONS)
  pluginFn.apply(COMPILER)

  expect($mockedMiniCssExtractPluginApply).toHaveBeenCalledTimes(1)
  expect($mockedMiniCssExtractPluginApply).toHaveBeenCalledWith(COMPILER)
})
