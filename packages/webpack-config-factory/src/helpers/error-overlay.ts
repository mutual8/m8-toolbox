/* eslint-disable global-require */
/** @todo Add proper types for react-error-overlay. */
/** @todo Use es6 import instead of require once types are available. */
const ErrorOverlay = require('react-error-overlay') as {
  dismissBuildError: any
  reportBuildError: any
  setEditorHandler: (
    handler?: (errorLoc: {
      fileName: string
      lineNumber?: number
      colNumber?: number
    }) => void
  ) => void
  startReportingRuntimeErrors: any
  stopReportingRuntimeErrors: any
}
/* eslint-enable global-require */

export default ErrorOverlay
