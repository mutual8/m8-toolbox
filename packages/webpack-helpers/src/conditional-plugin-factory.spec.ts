import { createConditionalWebpackPlugin } from './conditional-plugin-factory'

test('does not throw when called without a function', () => {
  expect(() => {
    const someString: any = 'this is not a function but a string'
    const Plugin = createConditionalWebpackPlugin(someString)
    const plugin = new Plugin({ enablePlugin: true })
    const mockCompiler: any = {}
    plugin.apply(mockCompiler)
  }).not.toThrow()
})

test('does not throw when the created plugin is called without options', () => {
  expect(() => {
    const Plugin: any = createConditionalWebpackPlugin(() => {})
    const plugin = new Plugin()
    plugin.apply()
  }).not.toThrow()
})

test('created plugin is applied only when options.enablePlugin === true', () => {
  const mockPluginFn = jest.fn()
  const mockCompiler: any = {}
  const Plugin = createConditionalWebpackPlugin(mockPluginFn)
  expect(mockPluginFn).not.toHaveBeenCalled()

  const notEnabled = new Plugin({ enablePlugin: false })
  notEnabled.apply(mockCompiler)
  expect(mockPluginFn).not.toHaveBeenCalled()

  const notExplicitlyEnabled = new Plugin({ enablePlugin: false })
  notExplicitlyEnabled.apply(mockCompiler)
  expect(mockPluginFn).not.toHaveBeenCalled()

  const Enabled = new Plugin({ enablePlugin: true })
  expect(mockPluginFn).not.toHaveBeenCalled()
  Enabled.apply(mockCompiler)
  expect(mockPluginFn).toHaveBeenCalledTimes(1)
  expect(mockPluginFn).toHaveBeenCalledWith(mockCompiler, {
    enablePlugin: true,
  })
})
