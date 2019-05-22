import {
  __SERIOUSLY_SECRET,
  AppDefinition,
  configureKit,
  createApp,
  useAppDefinitions,
} from '@o/kit'
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

const requireDynamicApps = () => {
  const rawApps = require('../../appDefinitions')
  return Object.keys(rawApps).map(simpleKey => rawApps[simpleKey].default)
}

let dynamicApps = requireDynamicApps()

export function getApps(): AppDefinition[] {
  return [...orbitStaticApps, ...dynamicApps]
}

export function getUserApps(): AppDefinition[] {
  return dynamicApps
}

// refreshes when they change
export function useUserApps() {
  useAppDefinitions() // this triggers update on app defs update
  return getUserApps()
}

export function useUserVisualApps() {
  return useUserApps().filter(x => !!x.app)
}

reaction(
  () => Desktop.state.workspaceState.appIdentifiers,
  async appIdentifiers => {
    console.log('appIdentifiers updated', appIdentifiers, requireDynamicApps())
    dynamicApps = requireDynamicApps()
    __SERIOUSLY_SECRET.reloadAppDefinitions()
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
