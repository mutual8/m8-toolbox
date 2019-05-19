import testCommand from '.'
import { handler as testHandler } from './handler'

jest.mock(
  './handler',
  (): { handler: jest.Mock } => ({
    handler: jest.fn(),
  })
)

test('command name is `test`', (): void => {
  expect(testCommand.command).toBe('test')
})

test('provides a useful description', (): void => {
  expect(testCommand.describe).toMatchInlineSnapshot(
    `"Runs the test watcher in an interactive mode."`
  )
})

test('provides the `test` handler', (): void => {
  testCommand.handler({ $0: '', _: [] })
  expect(testHandler).toBeCalled()
})
