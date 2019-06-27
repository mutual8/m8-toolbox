import * as webpack from 'webpack'

export = StartServerPlugin;
declare class StartServerPlugin extends webpack.Plugin {
  constructor(options?: {
    name?: string;
    nodeArgs?: string[];
    // pass args to script
    args?: string[];
    // signal to send for HMR (defaults to `false`, uses 'SIGUSR2' if `true`)
    signal?: boolean | 'SIGUSR2';
    // Allow typing 'rs' to restart the server. default: only if NODE_ENV is 'development'
    keyboard?: boolean;
  });
}
