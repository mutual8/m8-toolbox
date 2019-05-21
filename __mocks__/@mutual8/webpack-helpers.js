export const $mockedAggressiveMergingPluginApply = jest.fn()

export const AggressiveMergingPlugin = jest.fn().mockImplementation(() => ({
  apply: $mockedAggressiveMergingPluginApply,
}))

export const $mockedMiniCssExtractPluginApply = jest.fn()

export const MiniCssExtractPlugin = jest.fn().mockImplementation(() => ({
  apply: $mockedMiniCssExtractPluginApply,
}))

// This function is an implementation detail:
// - it should NOT be tested
// - it just needs to make other tests possible.
export const createConditionalWebpackPlugin = fn => {
  return class MockPlugin {
    constructor(options) {
      this.options = options
    }

    apply(compiler) {
      fn(compiler, this.options)
    }
  }
}
