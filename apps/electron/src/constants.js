export const IS_PROD = process.env.NODE_ENV === 'production'
export const APP_URL = IS_PROD
  ? 'http://app.seemirai.com:3001'
  : 'http://jot.dev'
export const APP_HOME = '/'
export const IS_MAC = process.platform === 'darwin'
