import invariant from 'invariant'

export const DB_HOSTNAME = process.env.DB_HOSTNAME
export const DB_PORT = process.env.DB_PORT
export const DB_HOST = `${DB_HOSTNAME}:${DB_PORT}`
export const DB_PROTOCOL = process.env.DB_PROTOCOL
export const DB_USER = process.env.DB_USER || ''
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_PUBLIC_URL = process.env.DB_PUBLIC_URL
export const DB_URL = `${DB_PROTOCOL}${DB_USER}:${DB_PASSWORD}@${DB_HOST}`

invariant(DB_HOST, 'must set DB_HOST')
invariant(DB_PORT, 'must set DB_PORT')
invariant(DB_PROTOCOL, 'must set DB_PROTOCOL')

export const IS_PROD = process.env.NODE_ENV === 'production'

export const APP_URL = process.env.APP_URL || 'http://jot.dev'

export const SERVER_PORT = process.env.PORT || 3000
