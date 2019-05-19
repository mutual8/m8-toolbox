import yargs from 'yargs'

import buildCommand from './commands/build'
import startCommand from './commands/start'
import testCommand from './commands/test'
import runScript from './run-script'

jest.mock(
  'yargs',
  (): any => ({
    alias: jest.fn(),
    command: jest.fn(),
    help: jest.fn(),
    parse: jest.fn(),
    usage: jest.fn(),
  })
)

test('provides help and usage information', (): void => {
  runScript()
  expect(yargs.help).toHaveBeenCalledTimes(1)
  expect(yargs.help).toHaveBeenCalledWith('help')
  expect(yargs.alias).toHaveBeenCalledWith('help', 'h')
  expect(yargs.usage).toHaveBeenCalledWith('Usage: mutual8 <command> [options]')
})

test('provides the `build`, `start`, and `test` command', (): void => {
  runScript()
  expect(yargs.command).toHaveBeenCalledTimes(3)
  expect(yargs.command).toHaveBeenCalledWith(buildCommand)
  expect(yargs.command).toHaveBeenCalledWith(startCommand)
  expect(yargs.command).toHaveBeenCalledWith(testCommand)
})

test('parses the passed arguments', (): void => {
  runScript()
  expect(yargs.parse).toHaveBeenCalledTimes(1)
})
