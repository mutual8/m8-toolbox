import mockConsole from 'jest-mock-console'

import logger from '.'

describe('logger.error()', () => {
  const LABEL = expect.stringMatching(/ERROR/i)
  const { error: logError } = logger

  it('is exported', () => {
    expect(logError).toBeDefined()
  })

  it('calls `console.error`', () => {
    const restoreConsole = mockConsole('error')

    logError('')

    expect(console.error).toHaveBeenCalled()

    restoreConsole()
  })

  it('logs with label that contains ERROR ', () => {
    const restoreConsole = mockConsole('error')

    logError('')

    const consoleError = console.error as jest.Mock
    const label = consoleError.mock.calls[0][0]

    expect(label).toEqual(LABEL)

    restoreConsole()
  })

  it('logs with label and message only, when a message but no context is passed', () => {
    const restoreConsole = mockConsole('error')

    logError('message')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(LABEL, 'message')

    restoreConsole()
  })

  it('logs with label and message first, and then context, when both a message and context are passed', () => {
    const restoreConsole = mockConsole('error')

    logError('message', 'context1', 'context2')

    expect(console.error).toHaveBeenCalledTimes(2)
    expect(console.error).toHaveBeenNthCalledWith(1, LABEL, 'message')
    expect(console.error).toHaveBeenNthCalledWith(2, 'context1', 'context2')

    restoreConsole()
  })
})

describe('logger.info()', () => {
  const LABEL = expect.stringMatching(/INFO/i)
  const { info: logInfo } = logger

  it('is exported', () => {
    expect(logInfo).toBeDefined()
  })

  it('calls `console.info`', () => {
    const restoreConsole = mockConsole('info')

    logInfo('')

    expect(console.info).toHaveBeenCalled()

    restoreConsole()
  })

  it('logs with label that contains INFO', () => {
    const restoreConsole = mockConsole('info')

    logInfo('')

    const consoleInfo = console.info as jest.Mock
    const label = consoleInfo.mock.calls[0][0]

    expect(label).toEqual(LABEL)

    restoreConsole()
  })

  it('logs with label and message only, when a message but no context is passed', () => {
    const restoreConsole = mockConsole('info')

    logInfo('message')

    expect(console.info).toHaveBeenCalledTimes(1)
    expect(console.info).toHaveBeenCalledWith(LABEL, 'message')

    restoreConsole()
  })

  it('logs with label and message first, and then context, when both a message and context are passed', () => {
    const restoreConsole = mockConsole('info')

    logInfo('message', 'context1', 'context2')

    expect(console.info).toHaveBeenCalledTimes(2)
    expect(console.info).toHaveBeenNthCalledWith(1, LABEL, 'message')
    expect(console.info).toHaveBeenNthCalledWith(2, 'context1', 'context2')

    restoreConsole()
  })
})

describe('logger.success()', () => {
  const LABEL = expect.stringMatching(/SUCCESS/i)
  const { success: logSuccess } = logger

  it('is exported', () => {
    expect(logSuccess).toBeDefined()
  })

  it('calls `console.info`', () => {
    const restoreConsole = mockConsole('info')

    logSuccess('')

    expect(console.info).toHaveBeenCalled()

    restoreConsole()
  })

  it('logs with label that contains SUCCESS ', () => {
    const restoreConsole = mockConsole('info')

    logSuccess('')

    const consoleInfo = console.info as jest.Mock
    const label = consoleInfo.mock.calls[0][0]

    expect(label).toEqual(LABEL)

    restoreConsole()
  })

  it('logs with label and message only, when a message but no context is passed', () => {
    const restoreConsole = mockConsole('info')

    logSuccess('message')

    expect(console.info).toHaveBeenCalledTimes(1)
    expect(console.info).toHaveBeenCalledWith(LABEL, 'message')

    restoreConsole()
  })

  it('logs with label and message first, and then context, when both a message and context are passed', () => {
    const restoreConsole = mockConsole('info')

    logSuccess('message', 'context1', 'context2')

    expect(console.info).toHaveBeenCalledTimes(2)
    expect(console.info).toHaveBeenNthCalledWith(1, LABEL, 'message')
    expect(console.info).toHaveBeenNthCalledWith(2, 'context1', 'context2')

    restoreConsole()
  })
})

describe('logger.warn()', () => {
  const LABEL = expect.stringMatching(/WARNING/i)
  const { warn: logWarning } = logger

  it('is exported', () => {
    expect(logWarning).toBeDefined()
  })

  it('calls `console.warn`', () => {
    const restoreConsole = mockConsole('warn')

    logWarning('')

    expect(console.warn).toHaveBeenCalled()

    restoreConsole()
  })

  it('logs with label that contains WARNING ', () => {
    const restoreConsole = mockConsole('warn')

    logWarning('')

    const consoleWarn = console.warn as jest.Mock
    const label = consoleWarn.mock.calls[0][0]

    expect(label).toEqual(LABEL)

    restoreConsole()
  })

  it('logs with label and message only, when a message but no context is passed', () => {
    const restoreConsole = mockConsole('warn')

    logWarning('message')

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(LABEL, 'message')

    restoreConsole()
  })

  it('logs with label and message first, and then context, when both a message and context are passed', () => {
    const restoreConsole = mockConsole('warn')

    logWarning('message', 'context1', 'context2')

    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(console.warn).toHaveBeenNthCalledWith(1, LABEL, 'message')
    expect(console.warn).toHaveBeenNthCalledWith(2, 'context1', 'context2')

    restoreConsole()
  })
})
