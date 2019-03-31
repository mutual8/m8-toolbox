import chalk from 'chalk'

type Context = Error | Promise<any> | any[] | Record<string, any>
type LogFunction = (message: string, context?: Context) => void

const logContext = async (fn: Function, context?: any): Promise<any> => {
  const next = async (msg): Promise<any> => logContext(fn, await msg)
  if (!context) {
    return
  }
  if (Array.isArray(context)) {
    context.forEach(next)
  }
  if (context instanceof Promise) {
    context.then(await next).catch(await next)
  }
  if (typeof context === 'object') {
    fn(JSON.stringify(context, null, 2))
  } else {
    fn(context.toString())
  }
}

/**
 * System is unusable.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const emergency: LogFunction = (message, context): void => {
  console.error(chalk.bgRed.white('EMERGENCY'), message)
  logContext(console.error, context)
}

/**
 * Action must be taken immediately.
 *
 * Example: Entire website down, database unavailable, etc. This should
 * trigger the SMS alerts and wake you up.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const alert: LogFunction = (message, context): void => {
  console.error(message)
  logContext(console.error, context)
}

/**
 * Critical conditions.
 *
 * Example: Application component unavailable, unexpected exception.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const critical: LogFunction = (message, context): void => {
  console.error(message)
  logContext(console.error, context)
}

/**
 * Runtime errors that do not require immediate action but should typically
 * be logged and monitored.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const error: LogFunction = (message, context): void => {
  console.error(message)
  logContext(console.error, context)
}

/**
 * Exceptional occurrences that are not errors.
 *
 * Example: Use of deprecated APIs, poor use of an API, undesirable things
 * that are not necessarily wrong.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const warning: LogFunction = (message, context): void => {
  console.warn(message)
  logContext(console.warn, context)
}

/**
 * Normal but significant events.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const notice: LogFunction = (message, context): void => {
  console.log(message)
  logContext(console.log, context)
}

/**
 * Interesting events.
 *
 * Example: User logs in, SQL logs.
 *
 * @param string message
 * @param array context
 * @return void
 */
export const info: LogFunction = (message, context): void => {
  console.info(message)
  logContext(console.info, context)
}

/**
 * Detailed debug information.
 *
 * @param {string} message
 * @param array context
 * @return void
 */
export const debug: LogFunction = (message, context): void => {
  console.debug(message)
  logContext(console.debug, context)
}

const loggers = {
  emergency,
  alert,
  critical,
  error,
  warning,
  notice,
  info,
  debug,
}

/**
 * Logs with an arbitrary level.
 *
 * @param level
 * @param message
 * @param context
 *
 * @return void
 */
const createLogger = (
  level: string,
  message: string,
  context?: Context
): void => {
  try {
    loggers[level](message, context)
  } catch (_) {
    console.log(`[${level.toString().toLowerCase()}]`, message)
    logContext(console.info, context)
  }
}

export default createLogger
