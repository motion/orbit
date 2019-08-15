import { loadOne } from '@o/bridge'
import { AppIcon, Bit, configureKit, customItems, getAppDefinition, useAppState, useUserState } from '@o/kit'
import { BitModel } from '@o/models'
import { configureUseStore } from '@o/use-store'
import { configure as configureMobx } from 'mobx'
import page from 'page'
import React from 'react'

import { om } from './om/om'
import { StoreContext } from './StoreContext'

export function runConfigurations() {
  // stuff here will be re-run every save in development
  // so be sure it wants to run over and over

  configureKit({
    StoreContext,
    handleLink: path => {
      console.log('showing', path)
      page.show(path)
    },
  })

  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  // after this stuff is just run once (no hmr effects)

  configureMobx({
    // for easier debugging mobx stack traces
    disableErrorBoundaries: false,
    // for safer mutation points
    enforceActions: 'never',
  })

  const { configureUI, configureHotKeys } = require('@o/ui')

  configureUI({
    customItems,
    StoreContext,
    useAppState,
    useUserState,
    getIconForBit: (bit: Bit) => {
      const def = getAppDefinition(bit.appIdentifier!)
      const app = om.state.apps.activeApps.find(app => app.id === bit.appId)
      if (def && app) {
        return <AppIcon identifier={bit.appIdentifier} colors={app.colors} />
      }
      return bit.appIdentifier
    },
    async loadBit(id: number) {
      return await loadOne(BitModel, { args: { where: { id } } })
    },
  })

  configureUseStore({
    debugStoreState: true,
  })

  configureHotKeys({
    ignoreTags: [],
    ignoreRepeatedEventsWhenKeyHeldDown: false,
    ignoreKeymapAndHandlerChangesByDefault: false,
    // logLevel: 'verbose',
  })
}

if (module['hot']) {
  module['hot'].accept()
}
