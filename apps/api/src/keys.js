import invariant from 'invariant'

export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT
export const DB_PROTOCOL = process.env.DB_PROTOCOL
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD

invariant(DB_HOST, 'must set DB_HOST')
invariant(DB_PORT, 'must set DB_PORT')
invariant(DB_PROTOCOL, 'must set DB_PROTOCOL')

export const COUCH_URL = DB_USER
  ? `${DB_PROTOCOL}${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
  : `${DB_PROTOCOL}${DB_HOST}:${DB_PORT}`

export const REDIS_URL = process.env.REDIS_URL || 'redis://starter-redis:6379'

export const IS_PROD = process.env.NODE_ENV === 'production'

export const APP_URL = process.env.APP_URL || 'http://localhost:3001'

export const SERVER_PORT = process.env.PORT || 3000
