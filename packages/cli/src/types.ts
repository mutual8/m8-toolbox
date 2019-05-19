import * as webpack from 'webpack'

export type WebpackPlugin = webpack.Plugin
export type WebpackStats = webpack.Stats
export type WebpackConfiguration = webpack.Configuration

export type AddWebpackPlugin<T = {}> = (
  plugins: WebpackPlugin[],
  options: T & { target: 'client' | 'server'; isDevConfig: boolean }
) => WebpackPlugin[]
