// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  couchUrl: `${window.location.protocol}//couch.${window.location.host}`,
}

export const HEADER_HEIGHT = 40
export const SIDEBAR_WIDTH = 190

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
