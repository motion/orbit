import { AppDefinition, configureKit, customItems, useAppState, useUserState } from '@o/kit'
import { configureHotKeys, configureUI } from '@o/ui/config'
import { configureUseStore } from '@o/use-store'
import { configure as configureMobx } from 'mobx'
import page from 'page'

import { StoreContext } from './StoreContext'

export function runConfigurations(opts: { getLoadedApps: () => AppDefinition[] }) {
  // stuff here will be re-run every save in development
  // so be sure it wants to run over and over

  configureKit({
    StoreContext,
    getLoadedApps: opts.getLoadedApps,
    handleLink: path => {
      console.log('link', path)
      page.show(path)
    },
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
    StoreContext,
    useAppState,
    useUserState,
  })

  configureUseStore({
    debugStoreState: true,
  })

  configureHotKeys({
    ignoreTags: [],
  })
}

if (module['hot']) {
  module['hot'].accept()
}
