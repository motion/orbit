export const DB_HOST = process.env.DB_HOST || 'localhost:3001'
export const DB_USER = process.env.DB_USER || 'username'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password'

export const DB_PROTOCOL = 'https://'

export const COUCH_URL = `${DB_PROTOCOL}${DB_USER}:${DB_PASSWORD}@${DB_HOST}`

export const REDIS_URL = process.env.REDIS_URL || 'redis://starter-redis:6379'
