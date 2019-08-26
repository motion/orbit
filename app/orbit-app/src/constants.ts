export * from '@o/constants'

export const MENU_WIDTH = 300

export const IS_MENU = window.location.pathname === '/chrome'
export const IS_APP = window.location.pathname === '/app'

const appMatch = window.location.search.match(/id=([0-9]+)/)
export const WINDOW_ID = appMatch && appMatch[1] ? +appMatch[1] : 0

// menu and app sidebars are generally narrower
// this gives us a flag to show more narrow things
// mostly in the index apps
export const IS_MINIMAL = IS_MENU || IS_APP

export const IS_ELECTRON = navigator.userAgent.includes('Electron')

export const BORDER_RADIUS = 15
export const CHROME_PAD = 1
export const PEEK_BORDER_RADIUS = 10

export const SHADOW_PAD = 15

const protocol = `${window.location.protocol}//`
export const API_HOST = `${window.location.host}`
export const API_URL = `${protocol}${API_HOST}`
