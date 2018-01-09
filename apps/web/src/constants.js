export * from '@mcro/constants'

import { Constants } from '@mcro/black'

export const IS_ELECTRON = Constants.IS_ELECTRON
export const IS_PROD =
  process.env.NODE_ENV === 'production' || process.env.IS_PROD
export const IS_DEV = !IS_PROD

if (process.env.IS_PROD) {
  console.log('IS_PROD!')
}

export const VERSION = require('../package.json').version

export const oraBg = '#5e1bdf'
export const ORA_BG = [0, 0, 0, 0.95]
export const ORA_BG_FOCUSED = [0, 0, 0, 0.89]
export const ORA_BG_MAIN_OPAQUE = [32, 32, 32]
export const ORA_BG_MAIN = [...ORA_BG_MAIN_OPAQUE]
export const ORA_INNER_SHADOW = [0, 0, 20, 0, [0, 0, 0, 0.5]]
export const ORA_PAD = 20
export const ORA_WIDTH = 300
export const ORA_HEIGHT = 535
export const ORA_HEADER_HEIGHT = 40
export const ORA_HEADER_HEIGHT_FULL = 44
export const ACTION_BAR_HEIGHT = 40
export const HEADER_HEIGHT = 36
export const TRAY_WIDTH = 400
export const TRAY_HEIGHT = 500

export const SHADOW_GLINT_TOP = 'inset 0 0.5px rgba(255,255,255,0.08)'

export const IN_TRAY =
  IS_ELECTRON && (window.location + '').indexOf('?inTray') !== -1

const protocol = `${window.location.protocol}//`
export const API_HOST = IS_PROD
  ? `app.seemirai.com:3009`
  : `app.seemirai.com:3001`
export const API_URL = `${protocol}${API_HOST}`
export const COUCH_HOST = API_HOST
export const COUCH_URL = `${protocol}${COUCH_HOST}/couch`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  remoteUrl: COUCH_URL,
}

export const IS_BAR = window.location.pathname === '/'
export const IS_SETTINGS_PANE = window.location.pathname === '/settings'

const authService = window.location.search.match(/service\=(.*)/)
export const AUTH_SERVICE = authService ? authService[1] : null

const keysearch = window.location.search.match(/key=(.*)/)
export const APP_KEY = keysearch ? keysearch[1] : ''

export const GOOGLE_CLIENT_ID =
  '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com'
