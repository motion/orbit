export * from '@mcro/constants'

import { Constants } from '@mcro/black'
import * as UI from '@mcro/ui'

export const IS_ORBIT = window.location.pathname === '/orbit'
export const IS_PEEK = window.location.pathname.indexOf('/peek') === 0
export const IS_ELECTRON = Constants.IS_ELECTRON
export const IS_PROD =
  process.env.NODE_ENV === 'production' || process.env.IS_PROD
export const IS_DEV = !IS_PROD
export const VERSION = require('../package.json').version

export const BORDER_RADIUS = 14
export const SHADOW_PAD = 15
export const APP_SHADOW = [0, 0, 40, [0, 0, 0, 1]]
export const ORBIT_COLOR = UI.color('#714842')

const protocol = `${window.location.protocol}//`
export const API_HOST = IS_PROD ? 'app.seemirai.com:3009' : 'localhost:3001'
export const API_URL = `${protocol}${API_HOST}`

export const DB_CONFIG = {
  name: 'username',
  password: 'password',
  remoteUrl: `${protocol}${API_HOST}/couch`,
}

export const IS_BAR = window.location.pathname === '/'
export const IS_SETTINGS_PANE = window.location.pathname === '/settings'

const authService = window.location.search.match(/service=(.*)/)
export const AUTH_SERVICE = authService ? authService[1] : null

export const GOOGLE_CLIENT_ID =
  '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com'

export const allIntegrations = [
  {
    id: 'gmail',
    type: 'setting',
    integration: 'gmail',
    title: 'Google Mail',
    icon: 'gmail',
  },
  {
    id: 'gdocs',
    type: 'setting',
    integration: 'gdocs',
    title: 'Google Docs',
    icon: 'gdocs',
  },
  {
    id: 'github',
    type: 'setting',
    integration: 'github',
    title: 'Github',
    icon: 'github',
  },
  {
    id: 'slack',
    type: 'setting',
    integration: 'slack',
    title: 'Slack',
    icon: 'slack',
  },
  {
    id: 'website',
    type: 'setting',
    integration: 'website',
    title: 'Website',
    icon: 'webpage',
    oauth: false,
  },
  {
    id: 'folder',
    type: 'setting',
    integration: 'folder',
    title: 'Folder',
    icon: 'folder',
    oauth: false,
  },
]
