import logger from '@mutual8/cli-logger'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import { Stats } from 'webpack'

const handleWebpackErrors = (err: Error, stats: Stats): void => {
  if (err) {
    throw err
  }

  const messages = formatWebpackMessages(stats.toJson({}))
  if (messages.errors.length) {
    throw new Error(messages.errors.join('\n\n'))
  }

  if (messages.warnings.length) {
    const { CI } = process.env
    const isCI =
      !!CI && (typeof CI !== 'string' || CI.toLowerCase() !== 'false')
    if (isCI) {
      logger.warn(
        'Treating warnings as errors because process.env.CI = true. (Most CI servers set it automatically.)'
      )
      throw new Error(messages.warnings.join('\n\n'))
    }
  }
}

export default handleWebpackErrors
