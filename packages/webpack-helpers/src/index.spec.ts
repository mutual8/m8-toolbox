import webpack from 'webpack'

import * as index from '.'
import * as conditionalPluginFactory from './conditional-plugin-factory'

jest.mock('./conditional-plugin-factory', () => ({
  createConditionalWebpackPlugin: jest.fn(),
}))

jest.mock('webpack', () => ({
  HotModuleReplacementPlugin: jest.fn(),
  optimize: {
    AggressiveMergingPlugin: jest.fn()
  }
}))

test('exports createConditionalWebpackPlugin', () => {
  const exported: any = index.createConditionalWebpackPlugin
  const original: any = conditionalPluginFactory.createConditionalWebpackPlugin

  const args = 'test'
  exported(args)

  expect(original).toHaveBeenCalledTimes(1)
  expect(original).toHaveBeenCalledWith(args)
})

test('exports AggressiveMergingPlugin from webpack', () => {
  const exported: any = index.AggressiveMergingPlugin
  const original: any = webpack.optimize.AggressiveMergingPlugin

  const args = 'test'
  exported(args)

  expect(original).toHaveBeenCalledTimes(1)
  expect(original).toHaveBeenCalledWith(args)
})

test('exports HotModuleReplacementPlugin from webpack', () => {
  const exported: any = index.HotModuleReplacementPlugin
  const original: any = webpack.HotModuleReplacementPlugin

  const args = 'test'
  exported(args)

  expect(original).toHaveBeenCalledTimes(1)
  expect(original).toHaveBeenCalledWith(args)
})
