import { configureKit, customItems, Icon, useAppState, useUserState } from '@o/kit'
import { configureHotKeys, configureUI } from '@o/ui'
import { configureUseStore } from '@o/use-store'
import { configure as configureMobx } from 'mobx'
import { StoreContext } from './contexts'
import { getAppProps } from './helpers/getAppProps'

function configure() {
  // stuff here will be re-run every save in development
  // so be sure it wants to run over and over

  configureKit({
    StoreContext,
    getApps: require('./apps/orbitApps').getApps,
  })

  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  configureMobx({
    // for easier debugging mobx stack traces
    disableErrorBoundaries: false,
    // for safer mutation points
    enforceActions: 'never',
  })

  configureUI({
    customItems,
    useIcon: Icon,
    StoreContext,
    useAppState,
    useUserState,
    propsToItem: getAppProps,
  })

  configureUseStore({
    debugStoreState: true,
  })

  configureHotKeys({
    ignoreTags: [],
  })
}

configure()

if (module['hot']) {
  module['hot'].accept()
}
