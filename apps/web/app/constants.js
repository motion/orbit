// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'

export const API_HOST = `api.${window.location.host}`
export const API_URL = `http://${API_HOST}`

export const COUCH_PROTOCOL = `${window.location.protocol}//`
export const COUCH_HOST = `couch.${window.location.host}`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  couchUrl: `${COUCH_PROTOCOL}${COUCH_HOST}`,
  couchHost: COUCH_HOST,
}

export const HEADER_HEIGHT = 40
export const SIDEBAR_WIDTH = 450

export const IS_ELECTRON = isElectron()

function isElectron() {
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
