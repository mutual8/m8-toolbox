import { codeFrameColumns } from '@babel/code-frame'
import fs from 'fs'
import {
  getStackTraceLines,
  getTopFrame,
  separateMessageFromStack,
} from 'jest-message-util'

function pretty(error: Error | { message: string; stack: string }) {
  const { message, stack = '' } = error
  const lines = getStackTraceLines(stack)
  const topFrame = getTopFrame(lines)
  const fallback = `${message}${stack}`

  if (!topFrame) {
    return fallback
  }

  const { file, line = 0 } = topFrame
  try {
    const result = codeFrameColumns(
      fs.readFileSync(file, 'utf8'),
      { start: { line } },
      { highlightCode: true }
    )
    return `\n${message}\n\n${result}\n${stack}\n`
  } catch (_) {
    return fallback
  }
}

function usePrettyErrors() {
  const { prepareStackTrace } = Error

  Error.prepareStackTrace = (error, trace) => {
    const prepared = prepareStackTrace
      ? separateMessageFromStack(prepareStackTrace(error, trace))
      : error

    // Clean up Webpack's sourcemap namespacing in error stacks
    // @see https://github.com/facebook/create-react-app/blob/next/packages/react-dev-utils/formatWebpackMessages.js#L112
    prepared.stack = prepared.stack
      ? prepared.stack.replace('/build/webpack:', '')
      : prepared.stack

    return pretty(prepared)
  }
}

usePrettyErrors()
