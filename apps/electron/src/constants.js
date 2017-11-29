import Path from 'path'

export const IS_PROD = process.env.NODE_ENV !== 'development'
export const APP_URL = 'http://app.seemirai.com:3001'
export const APP_HOME = '/'
export const IS_MAC = process.platform === 'darwin'
export const ORA_WIDTH = 320
export const ROOT_PATH = Path.join(__dirname, '..')

console.log('Constants.APP_URL', APP_URL)
console.log('Constants.ROOT_PATH', ROOT_PATH)
