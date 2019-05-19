import './prepare-environment-variables'

import yargs from 'yargs'

import buildCommand from './commands/build'
import startCommand from './commands/start'
import testCommand from './commands/test'

const runScript = (): void => {
  yargs.help('help')
  yargs.alias('help', 'h')
  yargs.usage('Usage: mutual8 <command> [options]')

  yargs.command(buildCommand)
  yargs.command(startCommand)
  yargs.command(testCommand)

  yargs.parse()
}

export default runScript
