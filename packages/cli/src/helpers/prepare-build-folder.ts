import { copy, emptyDir } from 'fs-extra'

import { BUILD_FOLDER, BUILD_PUBLIC_FOLDER, PUBLIC_FOLDER } from './constants'
import monitorFileSizes, { FilesizeReporter } from './monitor-filesizes'

export type PrepareBuildFolder = (folders?: {
  public?: string
  build?: string
  buildPublic?: string
}) => Promise<FilesizeReporter>

const prepareBuildFolder: PrepareBuildFolder = async (folders = {}) => {
  const {
    build: buildFolder = BUILD_FOLDER,
    public: publicFolder = PUBLIC_FOLDER,
    buildPublic: buildPublicFolder = BUILD_PUBLIC_FOLDER,
  } = folders
  // Remove existing build files.
  await emptyDir(buildFolder)

  // Copy 'public' folder to 'createWebpackConfigbuild/public' folder.
  await copy(publicFolder, buildPublicFolder, {
    dereference: true,
  })

  return monitorFileSizes(buildFolder)
}

export default prepareBuildFolder
