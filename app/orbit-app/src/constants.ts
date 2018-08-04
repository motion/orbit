export * from '@mcro/constants'

import * as UI from '@mcro/ui'

export const IS_ORBIT = window.location.pathname === '/orbit'
export const IS_PEEK = window.location.pathname.indexOf('/peek') === 0
export const IS_PROD =
  process.env.NODE_ENV === 'production' || process.env.IS_PROD
export const IS_DEV = !IS_PROD
export const VERSION = require('../package.json').version

export const BORDER_RADIUS = 15
export const CHROME_PAD = 4
export const PEEK_BORDER_RADIUS = 6

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

export const NICE_INTEGRATION_NAMES = {
  slack: 'Slack',
  gdocs: 'Google Docs',
  gmail: 'Gmail',
  confluence: 'Confluence',
  jira: 'Jira',
  github: 'Github',
}

export const EMPTY_ITEM = {
  id: '',
  title: '',
  body: '',
  subtitle: '',
  location: '',
  icon: '',
  type: '',
  subType: '',
  integration: '',
}

export const PEEK_THEMES = {
  base: {
    background: '#fff',
    color: '#444',
  },
  type: {
    person: {
      darkenTitleBarAmount: 0,
      titlebarBackground:
        'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.1) 90%, transparent)',
      titlebarBorder: 'transparent',
      headerBackground: 'transparent',
      background: '#f2f2f2',
      color: '#444',
    },
  },
  integration: {
    slack: {
      darkenTitleBarAmount: 0.1,
      background: '#FDDE64',
    },
    github: {
      darkenTitleBarAmount: 0.1,
      background: '#353535',
      color: 'white',
    },
    gdocs: {
      darkenTitleBarAmount: 0.1,
      background: '#7DA5F4',
    },
    jira: {
      darkenTitleBarAmount: 0.1,
      background: '#4978D0',
      color: 'white',
    },
    confluence: {
      darkenTitleBarAmount: 0.1,
      background: '#4B7BD4',
      color: 'white',
    },
    gmail: {
      darkenTitleBarAmount: 0.1,
      background: '#D2675E',
      color: 'white',
    },
  },
}
