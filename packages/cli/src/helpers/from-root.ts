import { realpathSync } from 'fs-extra'
import { resolve } from 'path'
import pkgUp from 'pkg-up'

const root = pkgUp.sync({ cwd: realpathSync(process.cwd()) })

if (!root) {
  throw new Error('Could not find the package.json file.')
}

const fromRoot = (...segments: string[]): string => resolve(root, ...segments)

export default fromRoot
