import logger from '@mutual8/cli-logger'
import cluster from 'cluster'

import { createConditionalWebpackPlugin } from '../helpers/create-conditional-plugin'

const StartWebserverPlugin = createConditionalWebpackPlugin<{
  name?: string
  disableRestarting?: boolean
  disableSignal?: boolean
  isDevConfig?: boolean
}>((compiler, options) => {
  const entryPoint = (() => {
    let state: string

    const get = () => state
    const set = (exec?: string) => {
      if (exec) {
        state = exec
      }
    }

    return { get, set }
  })()

  const clusterWorker = (() => {
    let state: cluster.Worker

    const isConnected = () => !!state && state.isConnected()
    const kill = (signal?: 'SIGUSR2') => {
      if (isConnected()) {
        process.kill(state.process.pid, signal)
      }
    }
    const set = (worker: cluster.Worker) => {
      state = worker
    }

    return { isConnected, kill, set }
  })()

  function startServer(onOnline: (worker: cluster.Worker) => void) {
    const exec = entryPoint.get()

    const execArgv: string[] = []
    if (options.isDevConfig) {
      execArgv.push(...['-r', 'source-map-support/register'])
      if (process.env.INSPECT_BRK) {
        execArgv.push(process.env.INSPECT_BRK)
      } else if (process.env.INSPECT) {
        execArgv.push(process.env.INSPECT)
      }
    }
    execArgv.push(...process.execArgv)

    let inspectPort: number | undefined
    const inspectArg = execArgv.find(arg => arg.includes('--inspect'))
    if (inspectArg && inspectArg.includes('=')) {
      const hostPort = inspectArg.split('=')[1]
      const port = hostPort.includes(':') ? hostPort.split(':')[1] : hostPort
      inspectPort = Number(port)
    }

    cluster.setupMaster({ exec, execArgv, inspectPort })
    cluster.on('online', onOnline)
    cluster.fork()
  }

  if (!options.disableRestarting) {
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', data => {
      if (data.trim() === 'rs') {
        logger.info('Restarting app...')
        clusterWorker.kill()
        startServer(clusterWorker.set)
      }
    })
  }

  compiler.hooks.afterEmit.tapAsync(
    'StartWebserverPlugin',
    (compilation, callback) => {
      if (clusterWorker.isConnected()) {
        if (!options.disableSignal) {
          clusterWorker.kill('SIGUSR2')
        }

        callback()
      } else {
        const { name = 'server.js' } = options
        if (!compilation.assets[name]) {
          logger.error(
            `Compilation asset ${name} not found. Try one of: ${Object.keys(
              compilation.assets
            ).join(' ')}`
          )
        } else {
          entryPoint.set(compilation.assets[name].existsAt)
        }

        startServer(worker => {
          clusterWorker.set(worker)
          callback()
        })
      }
    }
  )
})

export default StartWebserverPlugin
