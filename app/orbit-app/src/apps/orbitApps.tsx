import { AppDefinition, configureKit, createApp } from '@o/kit'
import { Loading } from '@o/ui'
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

let orbitDynamicApps = [
  require('@o/postgres-app').default,
  require('@o/demo-app-user-manager').default,
]

export function getApps(): AppDefinition[] {
  return [...orbitStaticApps, ...orbitDynamicApps]
}

// reaction(
//   () => Desktop.state.workspaceState.appIdentifiers,
//   async appIdentifiers => {
//     const appImport = appIdentifiers
//       .map(id => {
//         return `require('${id}')`
//       })
//       .join(',')

//     const appDefinitions = eval(appImport)
//     console.log('orbitDynamicApps', appImport, appDefinitions)
//   },
//   {
//     fireImmediately: true,
//   },
// )

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
