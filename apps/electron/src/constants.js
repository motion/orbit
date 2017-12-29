export * from '@mcro/constants'

import Path from 'path'

export const IS_PROD = process.env.NODE_ENV !== 'development'
export const IS_DEV = !IS_PROD
export const APP_URL = IS_PROD
  ? 'http://app.seemirai.com:3009'
  : 'http://localhost:3001'
export const APP_HOME = '/'
export const IS_MAC = process.platform === 'darwin'
export const ORA_WIDTH = 320
export const ROOT_PATH = Path.join(__dirname, '..')

export const WEB_PREFERENCES = {
  nativeWindowOpen: true,
  experimentalFeatures: true,
  transparentVisuals: true,
  allowRunningInsecureContent: true,
  plugins: true,
  // offscreen: true,
}

console.log('Constants.APP_URL', APP_URL)
console.log('Constants.ROOT_PATH', ROOT_PATH)
