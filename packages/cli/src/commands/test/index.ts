import { CommandModule } from 'yargs'

const command: CommandModule = {
  command: 'test',
  describe: 'Runs the test watcher in an interactive mode.',
  builder: {},
  handler: (argv): void => {
    // eslint-disable-next-line global-require
    require('./handler').handler(argv)
  },
}

export default command
