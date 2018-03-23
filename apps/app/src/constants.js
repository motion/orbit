export * from '@mcro/constants'

import { Constants } from '@mcro/black'

export const IS_ELECTRON = Constants.IS_ELECTRON
export const IS_PROD =
  process.env.NODE_ENV === 'production' || process.env.IS_PROD
export const IS_DEV = !IS_PROD
export const VERSION = require('../package.json').version

export const ORBIT_COLOR = '#6345CC'

const protocol = `${window.location.protocol}//`
export const API_HOST = IS_PROD ? `app.seemirai.com:3009` : `localhost:3001`
export const API_URL = `${protocol}${API_HOST}`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  remoteUrl: `${protocol}${API_HOST}/couch`,
}

export const IS_BAR = window.location.pathname === '/'
export const IS_SETTINGS_PANE = window.location.pathname === '/settings'

const authService = window.location.search.match(/service=(.*)/)
export const AUTH_SERVICE = authService ? authService[1] : null

export const GOOGLE_CLIENT_ID =
  '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com'
