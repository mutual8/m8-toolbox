import fs from 'fs'
import path from 'path'

export function getNodePathArray(): string[] {
  return (process.env.NODE_PATH || '')
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(fs.realpathSync(process.cwd()), folder))
    .filter(Boolean)
}
