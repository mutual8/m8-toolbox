import * as helpers from '@mutual8/webpack-helpers'

import Plugin from '.'

const {
  $mockedAggressiveMergingPluginApply,
  AggressiveMergingPlugin,
} = helpers as any

const OPTIONS: any = { pluginOptions: 'pluginOptions' }
const COMPILER: any = { compiler: 'compilerOptions' }

test('when created but NOT applied, does NOT create AggressiveMergingPlugin instance', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pluginFn = new Plugin(OPTIONS)

  expect(AggressiveMergingPlugin).not.toHaveBeenCalled()
  expect($mockedAggressiveMergingPluginApply).not.toHaveBeenCalled()
})

test('when applied, creates AggressiveMergingPlugin instance without options', () => {
  const pluginFn = new Plugin(OPTIONS)
  pluginFn.apply(COMPILER)

  expect(AggressiveMergingPlugin).toHaveBeenCalledTimes(1)
  expect(AggressiveMergingPlugin).toHaveBeenCalledWith(/* undefined */)
})

test('when applied, applies AggressiveMergingPlugin', () => {
  const pluginFn = new Plugin(OPTIONS)
  pluginFn.apply(COMPILER)

  expect($mockedAggressiveMergingPluginApply).toHaveBeenCalledTimes(1)
  expect($mockedAggressiveMergingPluginApply).toHaveBeenCalledWith(COMPILER)
})
