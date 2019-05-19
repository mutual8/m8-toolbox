import {
  measureFileSizesBeforeBuild,
  OpaqueFileSizes,
  printFileSizesAfterBuild,
} from 'react-dev-utils/FileSizeReporter'
import { Stats } from 'webpack'

export type FilesizeReporter = {
  printFileSizesAfterBuild: (stats: Stats) => void
}

type CreateFilesizeReporter = (
  sizesBeforeBuild: OpaqueFileSizes,
  folder: string
) => FilesizeReporter

const reportAfterBuild: CreateFilesizeReporter = (
  sizesBeforeBuild,
  folder
) => ({
  printFileSizesAfterBuild: stats => {
    // logger.info('New file sizes:', beforeBuild)
    printFileSizesAfterBuild(stats, sizesBeforeBuild, folder)
  },
})

type MonitorFilesizesOptions = (folder: string) => Promise<FilesizeReporter>
const monitorFileSizes: MonitorFilesizesOptions = async folder => {
  const sizesBeforeBuild = await measureFileSizesBeforeBuild(folder)

  return reportAfterBuild(sizesBeforeBuild, folder)
}

export default monitorFileSizes
