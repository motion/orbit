export const IS_PROD = process.env.NODE_ENV === 'production'

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  couchUrl: IS_PROD ? 'http://couch.write.sexy' : 'http://couch.jot.dev',
}

export const HEADER_HEIGHT = 38
export const SIDEBAR_WIDTH = 210
