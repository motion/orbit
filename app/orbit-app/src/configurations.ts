import { configureGloss } from '@mcro/gloss'
import { configureKit, Icon } from '@mcro/kit'
import { configureUI } from '@mcro/ui'
import { configureUseStore } from '@mcro/use-store'
import { configure as configureMobx } from 'mobx'
import { StoreContext } from './contexts'

// run these only once, and avoid HMR above it
function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true

  // stuff here will be re-run every save in development
  // so be sure it wants to run over and over

  console.log(
    '123',
    require('./apps/orbitApps')
      .getApps()
      .find(x => x.id == 'search')
      .app.toString(),
  )

  configureKit({
    StoreContext,
    getApps: require('./apps/orbitApps').getApps,
  })

  if (hasConfigured) {
    return
  }

  configureMobx({
    // for easier debugging mobx stack traces
    disableErrorBoundaries: false,
    // for safer mutation points
    enforceActions: 'never',
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

configure()

if (module['hot']) {
  module['hot'].accept()
}
