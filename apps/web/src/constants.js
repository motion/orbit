// @flow
// export constants from @mcro/black
import { IS_ELECTRON } from '@mcro/black'

export * from '@mcro/black/lib/constants'

export const PROTOCOL = `${window.location.protocol}//`
export const HOST = window.location.host
export const API_HOST = `api.${HOST}`
export const API_URL = `${PROTOCOL}${API_HOST}`
export const COUCH_HOST = `api.${HOST}`
export const COUCH_URL = `${PROTOCOL}${COUCH_HOST}/couch`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  couchUrl: COUCH_URL,
  couchHost: COUCH_HOST,
}

export const HEADER_HEIGHT = 46
export const SIDEBAR_WIDTH = 340
export const SIDEBAR_TRANSITION = 'ease-in 100ms'

export const IN_TRAY =
  IS_ELECTRON && (window.location + '').indexOf('?inTray') !== -1

export const TRAY_WIDTH = 400
export const TRAY_HEIGHT = 500

export const IS_BAR = window.location.pathname.indexOf('/bar') > -1
console.log('IS_BAR', IS_BAR)

const keysearch = window.location.search.match(/key=(.*)/)
export const KEY = keysearch ? keysearch[1] : ''
