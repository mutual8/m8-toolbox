import { config as loadDotenvFile } from 'dotenv'
import { existsSync } from 'fs-extra'

import fromRoot from './from-root'

const DOTENV_FILE = fromRoot('.env')

if (existsSync(DOTENV_FILE)) {
  loadDotenvFile({ path: DOTENV_FILE })
}

if (!process.env.NODE_ENV) {
  throw new Error(
    `The 'NODE_ENV' environment variable is required but was not specified.`
  )
}
