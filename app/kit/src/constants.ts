const appMatch = window.location.search.match(/id=([0-9]+)/)
export const APP_ID = appMatch && appMatch[1] ? +appMatch[1] : 0

export const IS_ELECTRON = !window['notInElectron']

const protocol = `${window.location.protocol}//`
export const API_HOST = `${window.location.host}`
export const API_URL = `${protocol}${API_HOST}`
