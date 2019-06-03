import { __SERIOUSLY_SECRET, AppDefinition, configureKit, createApp, decorate, react, useAppDefinitions } from '@o/kit'
import { Desktop } from '@o/stores'
import { Loading } from '@o/ui'
import { createElement } from 'react'

import { StoreContext } from '../StoreContext'
import AppsApp from './apps/AppsApp'
import BitApp from './BitApp'
import HomeApp from './HomeApp'
import MessageApp from './MessageApp'
import OnboardApp from './OnboardApp'
import QueryBuilderApp from './QueryBuilderApp'
import SettingsApp from './settings/SettingsApp'
import SetupAppApp from './SetupAppApp'
import SpacesApp from './spaces/SpacesApp'

export function startAppLoadWatch() {
  console.log('Watching for updated apps...')

  @decorate
  class WatchAppIdentifiers {
    watcher = react(
      () => Desktop.state.workspaceState.appIdentifiers,
      async appIdentifiers => {
        dynamicApps = requireDynamicApps()
        console.log('appIdentifiers updated', appIdentifiers, dynamicApps)
        __SERIOUSLY_SECRET.reloadAppDefinitions()
      },
    )
  }

  new WatchAppIdentifiers()
}

const LoadingApp = createApp({
  name: 'Loading...',
  icon: '',
  id: 'loading',
  app: () => createElement(Loading),
})

// apps we use internally in orbit

export const orbitStaticApps: AppDefinition[] = [
  QueryBuilderApp,
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

export function useStaticAppDefinitions() {
  return orbitStaticApps
}

// refreshes when they change
export function useUserAppDefinitions() {
  useAppDefinitions() // this triggers update on app defs update
  return getUserApps()
}

export function useUserVisualAppDefinitions() {
  return useUserAppDefinitions().filter(x => !!x.app)
}

export function useUserDataAppDefinitions() {
  return useUserAppDefinitions().filter(x => !!(x.api || x.graph))
}

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
