export const DB_HOSTNAME = process.env.DB_HOSTNAME
export const DB_PORT = process.env.DB_PORT
export const DB_HOST = `${DB_HOSTNAME}:${DB_PORT}`
export const DB_PROTOCOL = process.env.DB_PROTOCOL
export const DB_USER = process.env.DB_USER || ''
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_PUBLIC_URL = process.env.DB_PUBLIC_URL
export const DB_URL = `${DB_PROTOCOL}${DB_USER}:${DB_PASSWORD}@${DB_HOST}`

export const IS_PROD =
  (process.env.NODE_ENV === 'production' || process.env.IS_PROD) &&
  !process.env.LOCAL_PROD

console.log('IS_PROD', IS_PROD)

export const PUBLIC_URL = IS_PROD
  ? 'http://seemirai.com'
  : 'http://localhost:3002'
export const API_HOST = IS_PROD ? 'app.seemirai.com' : 'orbit.dev'

export const SERVER_PORT = process.env.PORT || 3001
