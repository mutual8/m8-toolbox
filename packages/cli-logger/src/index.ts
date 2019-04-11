import chalk from 'chalk'

type LoggerFn = (msg: string, ...context: any[]) => void
type CreateLogger = (fn: Function, label: string) => LoggerFn
export interface Logger {
  error: LoggerFn
  info: LoggerFn
  success: LoggerFn
  warn: LoggerFn
}

const createLogger: CreateLogger = (fn, label) => (msg, ...context) => {
  fn(label, msg)

  if (context.length) {
    fn(...context)
  }
}

const logger: Logger = {
  error: createLogger(
    (...args: []) => console.error(...args),
    chalk.bgRedBright.whiteBright('ERROR')
  ),
  info: createLogger(
    (...args: []) => console.info(...args),
    chalk.bgCyanBright.whiteBright('INFO')
  ),
  success: createLogger(
    (...args: []) => console.info(...args),
    chalk.bgGreenBright.whiteBright('SUCCESS')
  ),
  warn: createLogger(
    (...args: []) => console.warn(...args),
    chalk.bgYellowBright.black('WARNING')
  ),
}

export default logger
