import { CommandModule } from 'yargs'

const command: CommandModule = {
  command: 'start',
  describe: 'Runs the app in development mode.',
  builder: {},
  handler: (argv): void => {
    // eslint-disable-next-line global-require
    require('./handler').handler(argv)
  },
}

export default command
