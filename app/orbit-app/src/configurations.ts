import { configureGloss } from '@mcro/gloss'
import { configureKit, Icon } from '@mcro/kit'
import { configureUI } from '@mcro/ui'
import { configureUseStore } from '@mcro/use-store'
import { configure as configureMobx } from 'mobx'
import { getApps } from './apps/orbitApps'
import { StoreContext } from './contexts'

// run these only once, and avoid HMR above it
function setup() {
  window['hasConfigured'] = true

  configureMobx({
    // for easier debugging mobx stack traces
    disableErrorBoundaries: false,
    // for safer mutation points
    enforceActions: 'never',
  })

  configureKit({
    StoreContext,
    getApps,
  })

  configureGloss({
    pseudoAbbreviations: {
      hoverStyle: '&:hover',
      activeStyle: '&:active',
      focusStyle: '&:focus',
    },
  })

  configureUI({
    useIcon: Icon,
    StoreContext,
  })

  configureUseStore({
    debugStoreState: true,
  })
}

if (!window['hasConfigured']) {
  setup()
}

if (module['hot']) {
  module['hot'].accept('./apps/orbitApps', () => {
    console.log('accept meeee')
    const apps = require('./apps/orbitApps').orbitApps
    const getApps = () => apps
    console.log('configurationsapply', getApps)
    configureKit({
      StoreContext,
      getApps,
    })
  })
}
