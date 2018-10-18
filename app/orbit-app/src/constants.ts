export * from '@mcro/constants'

import * as UI from '@mcro/ui'

export const IS_APP = window.location.pathname === '/app'
export const APP_ID = IS_APP ? +window.location.search.match(/id=([0-9]+)/)[1] : null

export const BORDER_RADIUS = 15
export const CHROME_PAD = 1
export const PEEK_BORDER_RADIUS = 7

export const SHADOW_PAD = 15
export const ORBIT_COLOR = UI.color('#714842')

const protocol = `${window.location.protocol}//`
export const API_HOST = `${window.location.host}`
export const API_URL = `${protocol}${API_HOST}`

export const RECENT_HMR = () =>
  process.env.NODE_ENV === 'development' && Date.now() - window['__lastHMR'] < 700
