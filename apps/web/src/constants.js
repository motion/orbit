// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'

export const PROTOCOL = `${window.location.protocol}//`
export const HOST = window.location.host
export const API_HOST = `api.${HOST}`
export const API_URL = `${PROTOCOL}${API_HOST}`
export const COUCH_HOST = `couch.${HOST}`
export const COUCH_URL = `${PROTOCOL}${COUCH_HOST}`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  couchUrl: COUCH_URL,
  couchHost: COUCH_HOST,
}

export const HEADER_HEIGHT = 40
export const SIDEBAR_WIDTH = 340
export const SIDEBAR_TRANSITION = `ease-in 100ms`

export const IS_ELECTRON = isElectron()

function isElectron(): boolean {
  if (
    typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
  ) {
    return true
  }
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    !!process.versions.electron
  ) {
    return true
  }
  return false
}

export const IN_TRAY =
  IS_ELECTRON && (window.location + '').indexOf('?inTray') !== -1

export const TRAY_WIDTH = 400
export const TRAY_HEIGHT = 500
