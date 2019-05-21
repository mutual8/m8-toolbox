import * as helpers from '@mutual8/webpack-helpers'

import Plugin from '.'

const {
  $mockedHotModuleReplacementPluginApply,
  HotModuleReplacementPlugin,
}: { [key: string]: jest.Mock } = helpers as any

const OPTIONS: any = { pluginOptions: 'pluginOptions' }
const COMPILER: any = { compiler: 'compilerOptions' }

test('when created but NOT applied, does NOT create HotModuleReplacementPlugin instance', () => {
  const pluginFn = new Plugin(OPTIONS)

  expect(HotModuleReplacementPlugin).not.toHaveBeenCalled()
  expect($mockedHotModuleReplacementPluginApply).not.toHaveBeenCalled()
})

test('when applied and target is NOT web, creates HotModuleReplacementPlugin instance without options', () => {
  const inputWithTargetIsNotWeb = [
    {
      options: { target: 'not-web' },
      compiler: { options: { target: 'web' } },
    },
    {
      options: { target: 'not-web' },
      compiler: { options: { target: 'not-web' } },
    },
    {
      options: { target: 'not-web' },
      compiler: { options: {} },
    },
    {
      options: { target: 'not-web' },
      compiler: {},
    },
    {
      options: {},
      compiler: { options: { target: 'not-web' } },
    },
    {
      options: {},
      compiler: { options: {} },
    },
    {
      options: {},
      compiler: {},
    },
  ]

  expect.assertions(2 * inputWithTargetIsNotWeb.length)

  inputWithTargetIsNotWeb.forEach(({ options, compiler }) => {
    const pluginFn = new Plugin(options as any)
    pluginFn.apply(compiler as any)

    expect(HotModuleReplacementPlugin).toHaveBeenCalledTimes(1)
    expect(HotModuleReplacementPlugin).toHaveBeenCalledWith(undefined)
    HotModuleReplacementPlugin.mockClear()
  })
})

test('when applied and target is web, creates HotModuleReplacementPlugin instance with multiStep set to true', () => {
  const inputWithTargetIsWeb = [
    {
      options: { target: 'web' },
      compiler: { options: { target: 'not-web' } },
    },
    {
      options: { target: 'web' },
      compiler: { options: {} },
    },
    {
      options: { target: 'web' },
      compiler: {},
    },
    {
      options: { target: null },
      compiler: { options: { target: 'web' } },
    },
    {
      options: { target: false },
      compiler: { options: { target: 'web' } },
    },
    {
      options: {},
      compiler: { options: { target: 'web' } },
    },
  ]

  expect.assertions(2 * inputWithTargetIsWeb.length)

  inputWithTargetIsWeb.forEach(({ options, compiler }) => {
    const pluginFn = new Plugin(options as any)
    pluginFn.apply(compiler as any)

    expect(HotModuleReplacementPlugin).toHaveBeenCalledTimes(1)
    expect(HotModuleReplacementPlugin).toHaveBeenCalledWith({
      multiStep: true,
    })
    HotModuleReplacementPlugin.mockClear()
  })
})

test('when applied, applies HotModuleReplacementPlugin', () => {
  const pluginFn = new Plugin(OPTIONS)
  pluginFn.apply(COMPILER)

  expect($mockedHotModuleReplacementPluginApply).toHaveBeenCalledTimes(1)
  expect($mockedHotModuleReplacementPluginApply).toHaveBeenCalledWith(COMPILER)
})
