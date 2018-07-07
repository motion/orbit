export const PEEK_SIZE = [600, 700]
export const FORCE_FULLSCREEN = false
export const ORBIT_WIDTH = 340
export const ARROW_PAD = 15

export const wordKey = word => word.join('-')

export const IS_DEV = process.env.NODE_ENV === 'development'
export const API_HOST = IS_DEV ? 'localhost:3001' : 'app.seemirai.com'
export const API_URL = IS_DEV ? `http://${API_HOST}` : `https://${API_HOST}`
