import Path from 'path'

export const DB_HOSTNAME = process.env.DB_HOSTNAME
export const DB_PORT = process.env.DB_PORT
export const DB_HOST = `${DB_HOSTNAME}:${DB_PORT}`
export const DB_PROTOCOL = process.env.DB_PROTOCOL
export const DB_USER = process.env.DB_USER || ''
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_PUBLIC_URL = process.env.DB_PUBLIC_URL
export const DB_URL = `${DB_PROTOCOL}${DB_USER}:${DB_PASSWORD}@${DB_HOST}`

export const IS_DEV = process.env.NODE_ENV === 'development'
export const IS_PROD = !IS_DEV

export const PUBLIC_URL = IS_DEV
  ? 'http://localhost:3002'
  : 'http://seemirai.com'

export const API_HOST = IS_DEV ? 'orbit.dev' : 'app.seemirai.com'

export const SERVER_PORT = process.env.PORT || IS_DEV ? 3001 : 3009

export const TMP_DIR = Path.join(__dirname, '..', 'tmp')
