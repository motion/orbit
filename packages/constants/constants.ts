// export const PEEK_DIMENSIONS = [560, 450]

export const PEEK_SIZE = [550, 620]
export const FORCE_FULLSCREEN = false
export const ORBIT_WIDTH = 340
export const ARROW_PAD = 15

export const wordKey = word => word.join('-')

export const IS_DEV = process.env.NODE_ENV === 'development'
export const API_HOST = IS_DEV ? 'localhost' : 'app.seemirai.com'
