import logger from '@mutual8/cli-logger'
import { copy, emptyDir } from 'fs-extra'
import { measureFileSizesBeforeBuild } from 'react-dev-utils/FileSizeReporter'
import webpack from 'webpack'

import {
  BUILD_FOLDER,
  BUILD_PUBLIC_FOLDER,
  ENV_VARS,
  PUBLIC_FOLDER,
} from '../../helpers/constants'
import {
  createClientConfig,
  createServerConfig,
} from '../../helpers/create-webpack-config'
import handleWebpackErrors from '../../helpers/handle-webpack-errors'
import prepareBuildFolder from '../../helpers/prepare-build-folder'

const IS_DEV_CONFIG = false

export const handler = async (): Promise<void> => {
  // Measure pre-build file sizes and remove existing build files.
  const { printFileSizesAfterBuild } = await prepareBuildFolder({
    build: BUILD_FOLDER,
    buildPublic: BUILD_PUBLIC_FOLDER,
    public: PUBLIC_FOLDER,
  })

  const webpackConfigOptions = {
    IS_DEV_CONFIG,
    ENV_VARS,
    BUILD_FOLDER,
  }

  // Create webpack config for 'client'.
  const clientConfig = createClientConfig({ ...webpackConfigOptions })

  // Compile for 'client'.
  try {
    const compiler = webpack(clientConfig)
    await compiler.run(handleWebpackErrors)
  } catch (error) {
    logger.error('Failed to compile client files.', error)
    process.exit(1)
  }

  // Create webpack config for 'server'.
  const serverConfig = createServerConfig({ ...webpackConfigOptions })

  // Compile for 'server'.
  try {
    await webpack(serverConfig).run(handleWebpackErrors)
  } catch (error) {
    logger.error('Failed to compile server files.', error)
    process.exit(1)
  }

  // Compare current file sizes.
  printFileSizesAfterBuild({})
}
