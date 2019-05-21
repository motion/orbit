import { AppDefinition, configureKit, createApp } from '@o/kit'
import { Desktop } from '@o/stores'
import { Loading } from '@o/ui'
import { reaction } from 'mobx'
import { createElement } from 'react'

import { StoreContext } from '../StoreContext'
import AppsApp from './apps/AppsApp'
import BitApp from './BitApp'
import DataExplorerApp from './DataExplorerApp'
import HomeApp from './HomeApp'
import MessageApp from './MessageApp'
import OnboardApp from './OnboardApp'
import SettingsApp from './settings/SettingsApp'
import SetupAppApp from './SetupAppApp'
import SpacesApp from './spaces/SpacesApp'

const LoadingApp = createApp({
  name: 'Loading...',
  icon: '',
  id: 'loading',
  app: () => createElement(Loading),
})

// apps we use internally in orbit

export const orbitStaticApps: AppDefinition[] = [
  DataExplorerApp,
  SettingsApp,
  SpacesApp,
  AppsApp,
  BitApp,
  OnboardApp,
  SetupAppApp,
  MessageApp,
  HomeApp,
  LoadingApp,
]

let orbitDynamicApps = []

export function getApps(): AppDefinition[] {
  return [...orbitStaticApps, ...orbitDynamicApps]
}

// super hacky workaround for now
// @ts-ignore
const wrq = __webpack_require__
const requireApp = x => wrq(`../../apps/${x}/src/index.tsx`)
window['requireApp'] = requireApp

reaction(
  () => Desktop.state.workspaceState.appIdentifiers,
  async appIdentifiers => {
    const appDefinitions = appIdentifiers.map(x => {
      return requireApp(x.replace('@o/', '')).default
    })
    orbitDynamicApps = appDefinitions
  },
  {
    fireImmediately: true,
  },
)

if (module['hot']) {
  module['hot'].addStatusHandler(status => {
    // remove webpack bad compile message after hmr
    const iframe = document.querySelector('body > iframe')
    iframe && iframe.remove()

    if (status === 'apply') {
      configureKit({
        StoreContext,
        getLoadedApps: getApps,
      })
    }
  })
}
