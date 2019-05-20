import { optimize, Plugin as WebpackPlugin } from 'webpack'

const { AggressiveMergingPlugin: WebpackAggressiveMergingPlugin } = optimize

type Options = optimize.AggressiveMergingPlugin.Options

/**
 * Plugin for a more aggressive chunk merging strategy.
 *
 * Even similar chunks are merged if the total size is reduced enough.
 * As an option, modules that are not common in these chunks can be moved up the
 * chunktree to the parents.
 *
 * @see https://github.com/webpack/docs/wiki/list-of-plugins#aggressivemergingplugin
 */
export const AggressiveMergingPlugin: new (options?: {
  /**
   * Optional multiplicator for entry chunks. When the `moveToParents` option
   * is set, moving to an entry chunk is more expensive. Defaults to `10`:
   * moving to an entry chunk is ten times more expensive than moving to a
   * normal chunk.
   *
   * @default 10
   */
  entryChunkMultiplicator?: Options['entryChunkMultiplicator']
  /**
   * Optional factor which defines the minimal required size reduction for
   * chunk merging. Defaults to `1.5`: the total size needs to be reduced by
   * 50% for chunk merging.
   *
   * @default 1.5
   */
  minSizeReduce?: Options['minSizeReduce']
  /**
   * If set to `true`, modules that are not in both merged chunks are
   * moved to all parents of the chunk. Defaults to `false`.
   *
   * @default false
   */
  moveToParents?: Options['moveToParents']
}) => WebpackPlugin = WebpackAggressiveMergingPlugin
