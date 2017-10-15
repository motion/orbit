// @flow
// export constants from @mcro/black
import { IS_ELECTRON } from '@mcro/black'

export * from '@mcro/black/lib/constants'

const protocol = `${window.location.protocol}//`
export const API_HOST = `orbit.dev`
export const API_URL = `${protocol}${API_HOST}`
export const COUCH_HOST = API_HOST
export const COUCH_URL = `${protocol}${COUCH_HOST}/couch`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  remoteUrl: COUCH_URL,
}

export const HEADER_HEIGHT = 36

export const IN_TRAY =
  IS_ELECTRON && (window.location + '').indexOf('?inTray') !== -1

export const TRAY_WIDTH = 400
export const TRAY_HEIGHT = 500

export const IS_BAR = window.location.pathname === '/'

const authService = window.location.search.match(/service\=(.*)/)
export const AUTH_SERVICE = authService ? authService[1] : null

const keysearch = window.location.search.match(/key=(.*)/)
export const APP_KEY = keysearch ? keysearch[1] : ''

export const GOOGLE_CLIENT_ID =
  '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com'
