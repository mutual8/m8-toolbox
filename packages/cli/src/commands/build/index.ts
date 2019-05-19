import { CommandModule } from 'yargs'

const command: CommandModule = {
  command: 'build',
  describe: 'Builds the app for production.',
  builder: {
    BUILD_FOLDER: {
      string: true,
      default: 'build',
      demandOption: false,
    },
    PUBLIC_FOLDER: {
      string: true,
      default: 'public',
      demandOption: false,
    },
    BUILD_PUBLIC_FOLDER: {
      string: true,
      default: 'public',
      demandOption: false,
    },
    SRC_FOLDER: {
      string: true,
      default: 'src',
      demandOption: false,
    },
  },
  handler: (argv): void => {
    // eslint-disable-next-line global-require
    require('./handler').handler(argv)
  },
}

export default command
