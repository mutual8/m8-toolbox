import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import SockJS from 'sockjs-client'
import stripAnsi from 'strip-ansi'
import url from 'url'

import ErrorOverlay from './error-overlay'

/* eslint-disable global-require */
/** @todo Add proper types for react-dev-utils/launchEditorEndpoint. */
/** @todo Add proper types for react-error-overlay. */
/** @todo Use es6 import instead of require once types are available. */
const launchEditorEndpoint = require('react-dev-utils/launchEditorEndpoint') as string
/* eslint-enable global-require */

// This alternative WebpackDevServer combines the functionality of:
// https://github.com/webpack/webpack-dev-server/blob/webpack-1/client/index.js
// https://github.com/webpack/webpack/blob/webpack-1/hot/dev-server.js
global
// It only supports their simplest configuration (hot updates on same server).
// It makes some opinionated choices on top, like adding a syntax error overlay
// that looks similar to our console output. The error overlay is inspired by:
// https://github.com/glenjamin/webpack-hot-middleware
const hotDevClient = async (
  window: Window & { encodeURIComponent: typeof encodeURIComponent }
): Promise<void> => {
  ErrorOverlay.setEditorHandler(function editorHandler(errorLocation) {
    // Keep this sync with errorOverlayMiddleware.js
    /* eslint-disable no-undef */
    const { fetch, location, encodeURIComponent } = window

    const fileName = encodeURIComponent(errorLocation.fileName)
    const lineNumber = encodeURIComponent(`${errorLocation.lineNumber || 1}`)
    const colNumber = encodeURIComponent(`${errorLocation.colNumber || 1}`)

    const input = url.format({
      protocol: location.protocol,
      hostname: location.hostname,
      port: parseInt(process.env.PORT || location.port, 10) + 1,
      pathname: launchEditorEndpoint,
      search: `?filename=${fileName}&lineNumber=${lineNumber}&colNumber=${colNumber}`,
    })

    fetch(input, { mode: 'no-cors' })
  })

  // We need to keep track of if there has been a runtime error.
  // Essentially, we cannot guarantee application state was not corrupted by the
  // runtime error. To prevent confusing behavior, we forcibly reload the entire
  // application. This is handled below when we are notified of a compile (code
  // change).
  // See https://github.com/facebook/create-react-app/issues/3096
  var hadRuntimeError = false
  ErrorOverlay.startReportingRuntimeErrors({
    onError: function() {
      hadRuntimeError = true
    },
    filename: process.env.REACT_BUNDLE_PATH || '/static/js/bundle.js',
  })

  if (module.hot && typeof module.hot.dispose === 'function') {
    module.hot.dispose(function() {
      // TODO: why do we need this?
      ErrorOverlay.stopReportingRuntimeErrors()
    })
  }

  // Connect to WebpackDevServer via a socket.
  var connection = new SockJS(
    url.format({
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: parseInt(process.env.PORT || window.location.port, 10) + 1,
      // Hardcoded in WebpackDevServer
      pathname: '/sockjs-node',
    })
  )

  // Unlike WebpackDevServer client, we won't try to reconnect
  // to avoid spamming the console. Disconnect usually happens
  // when developer stops the server.
  connection.onclose = function() {
    if (typeof console !== 'undefined' && typeof console.info === 'function') {
      console.info(
        'The development server has disconnected.\nRefresh the page if necessary.'
      )
    }
  }

  // Remember some state related to hot module replacement.
  var isFirstCompilation = true
  var mostRecentCompilationHash = null
  var hasCompileErrors = false

  function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (typeof console !== 'undefined' && typeof console.clear === 'function') {
      if (hasCompileErrors) {
        console.clear()
      }
    }
  }

  // Successful compilation.
  function handleSuccess() {
    clearOutdatedErrors()

    var isHotUpdate = !isFirstCompilation
    isFirstCompilation = false
    hasCompileErrors = false

    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
      tryApplyUpdates(function onHotUpdateSuccess() {
        // Only dismiss it when we're sure it's a hot update.
        // Otherwise it would flicker right before the reload.
        ErrorOverlay.dismissBuildError()
      })
    }
  }

  // Compilation with warnings (e.g. ESLint).
  function handleWarnings(warnings) {
    clearOutdatedErrors()

    var isHotUpdate = !isFirstCompilation
    isFirstCompilation = false
    hasCompileErrors = false

    function printWarnings() {
      // Print warnings to the console.
      var formatted = formatWebpackMessages({
        warnings: warnings,
        errors: [],
      })

      if (
        typeof console !== 'undefined' &&
        typeof console.warn === 'function'
      ) {
        for (var i = 0; i < formatted.warnings.length; i++) {
          if (i === 5) {
            console.warn(
              'There were more warnings in other files.\n' +
                'You can find a complete log in the terminal.'
            )
            break
          }
          console.warn(stripAnsi(formatted.warnings[i]))
        }
      }
    }

    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
      tryApplyUpdates(function onSuccessfulHotUpdate() {
        // Only print warnings if we aren't refreshing the page.
        // Otherwise they'll disappear right away anyway.
        printWarnings()
        // Only dismiss it when we're sure it's a hot update.
        // Otherwise it would flicker right before the reload.
        ErrorOverlay.dismissBuildError()
      })
    } else {
      // Print initial warnings immediately.
      printWarnings()
    }
  }

  // Compilation with errors (e.g. syntax error or missing modules).
  function handleErrors(errors) {
    clearOutdatedErrors()

    isFirstCompilation = false
    hasCompileErrors = true

    // "Massage" webpack messages.
    var formatted = formatWebpackMessages({
      errors: errors,
      warnings: [],
    })

    // Only show the first error.
    ErrorOverlay.reportBuildError(formatted.errors[0])

    // Also log them to the console.
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      for (var i = 0; i < formatted.errors.length; i++) {
        console.error(stripAnsi(formatted.errors[i]))
      }
    }

    // Do not attempt to reload now.
    // We will reload on next success instead.
  }

  // There is a newer version of the code available.
  function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash
  }

  // Handle messages from the server.
  connection.onmessage = function(e) {
    var message = JSON.parse(e.data)
    switch (message.type) {
      case 'hash':
        handleAvailableHash(message.data)
        break
      case 'still-ok':
      case 'ok':
        handleSuccess()
        break
      case 'content-changed':
        // Triggered when a file from `contentBase` changed.
        window.location.reload()
        break
      case 'warnings':
        handleWarnings(message.data)
        break
      case 'errors':
        handleErrors(message.data)
        break
      default:
      // Do nothing.
    }
  }

  // Is there a newer version of this code available?
  function isUpdateAvailable() {
    /* globals __webpack_hash__ */
    // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    return mostRecentCompilationHash !== __webpack_hash__
  }

  // Webpack disallows updates in other states.
  function canApplyUpdates() {
    return module.hot.status() === 'idle'
  }

  // Attempt to update code on the fly, fall back to a hard reload.
  function tryApplyUpdates(onHotUpdateSuccess) {
    if (!module.hot) {
      // HotModuleReplacementPlugin is not in Webpack configuration.
      window.location.reload()
      return
    }

    if (!isUpdateAvailable() || !canApplyUpdates()) {
      return
    }

    function handleApplyUpdates(err, updatedModules) {
      if (err || !updatedModules || hadRuntimeError) {
        window.location.reload()
        return
      }

      if (typeof onHotUpdateSuccess === 'function') {
        // Maybe we want to do something.
        onHotUpdateSuccess()
      }

      if (isUpdateAvailable()) {
        // While we were updating, there was a new update! Do it again.
        tryApplyUpdates()
      }
    }

    // https://webpack.github.io/docs/hot-module-replacement.html#check
    var result = module.hot.check(/* autoApply */ true, handleApplyUpdates)

    // // Webpack 2 returns a Promise instead of invoking a callback
    if (result && result.then) {
      result.then(
        function(updatedModules) {
          handleApplyUpdates(null, updatedModules)
        },
        function(err) {
          handleApplyUpdates(err, null)
        }
      )
    }
  }
}

export default hotDevClient
