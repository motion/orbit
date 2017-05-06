// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  couchUrl: `${window.location.protocol}//couch.${window.location.host}`,
}

export const HEADER_HEIGHT = 40
export const SIDEBAR_WIDTH = 210
