import buildCommand from '.'
import { handler as buildHandler } from './handler'

jest.mock(
  './handler',
  (): { handler: jest.Mock } => ({
    handler: jest.fn(),
  })
)

test('command name is `build`', (): void => {
  expect(buildCommand.command).toBe('build')
})

test('provides a useful description', (): void => {
  expect(buildCommand.describe).toMatchInlineSnapshot(
    `"Builds the app for production."`
  )
})

test('provides the `build` handler', (): void => {
  buildCommand.handler({ $0: '', _: [] })
  expect(buildHandler).toBeCalled()
})
