export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_BROWSER = typeof window !== 'undefined'
const authService = IS_BROWSER && window.location.search.match(/service\=(.*)/)
export const AUTH_SERVICE = authService ? authService[1] : null
