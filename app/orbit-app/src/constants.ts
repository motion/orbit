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

export const NICE_INTEGRATION_NAMES = {
  slack: 'Slack',
  gdrive: 'Google Docs',
  gmail: 'Gmail',
  confluence: 'Confluence',
  jira: 'Jira',
  github: 'Github',
  app1: 'Custom App',
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
      darkenTitleBarAmount: 0.04,
      background: '#FDDE64',
    },
    github: {
      darkenTitleBarAmount: 0.04,
      background: '#353535',
      color: 'white',
    },
    gdrive: {
      darkenTitleBarAmount: 0.04,
      background: '#7DA5F4',
    },
    jira: {
      darkenTitleBarAmount: 0.04,
      background: '#4978D0',
      color: 'white',
    },
    confluence: {
      darkenTitleBarAmount: 0.04,
      background: '#4B7BD4',
      color: 'white',
    },
    gmail: {
      darkenTitleBarAmount: 0.04,
      background: '#D2675E',
      color: 'white',
    },
  },
}
