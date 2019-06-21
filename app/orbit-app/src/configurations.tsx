import { AppDefinition, AppIcon, Bit, configureKit, customItems, getAppDefinition, useAppState, useUserState } from '@o/kit'
import { configureHotKeys, configureUI } from '@o/ui/config'
import { configureUseStore } from '@o/use-store'
import { configure as configureMobx } from 'mobx'
import page from 'page'
import React from 'react'

import { om } from './om/om'
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
    getIconForBit: (bit: Bit) => {
      const def = getAppDefinition(bit.appIdentifier)
      const app = om.state.apps.activeApps.find(app => app.id === bit.appId)
      console.log('get', bit, def, app)
      if (def && app) {
        return <AppIcon identifier={bit.appIdentifier} colors={app.colors} />
      }
      return bit.appIdentifier
    },
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
