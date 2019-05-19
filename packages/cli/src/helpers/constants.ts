import fromRoot from './from-root'

export const BUILD_FOLDER: string = fromRoot('build')
export const BUILD_PUBLIC_FOLDER: string = fromRoot('build', 'public')
export const PUBLIC_FOLDER: string = fromRoot('public')
export const ENV_VARS: Record<string, string> = {}
export const HOST: string = process.env.HOST || 'localhost'
export const PORT: number = +(process.env.PORT || 3000)
export const SERVER_FILENAME = 'server.js'
