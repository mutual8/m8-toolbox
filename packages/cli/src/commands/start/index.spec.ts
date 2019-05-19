import startCommand from '.'
import { handler as startHandler } from './handler'

jest.mock(
  './handler',
  (): { handler: jest.Mock } => ({
    handler: jest.fn(),
  })
)

test('command name is `start`', (): void => {
  expect(startCommand.command).toBe('start')
})

test('provides a useful description', (): void => {
  expect(startCommand.describe).toMatchInlineSnapshot(
    `"Runs the app in development mode."`
  )
})

test('provides the `start` handler', (): void => {
  startCommand.handler({ $0: '', _: [] })
  expect(startHandler).toBeCalled()
})
