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
import HomeApp from './HomeApp'
import MessageApp from './MessageApp'
import OnboardApp from './OnboardApp'
import QueryBuilderApp from './QueryBuilderApp'
import SettingsApp from './settings/SettingsApp'
import SetupAppApp from './SetupAppApp'
import SpacesApp from './SpacesApp'

let dynamicApps: AppDefinition[] = []

async function updateDefinitions() {
  const rawApps = require('../../appDefinitions.js')
  console.log('rawApps', rawApps)
  dynamicApps = Object.keys(rawApps).map(simpleKey => rawApps[simpleKey].default)
  // this doesn't work because dynamic require doesn't use manifest
  // TODO we need to do something like this
  // const apps = await command(AppGetWorkspaceAppsCommand)
  // const allApps = apps.map(app => {
  //   return require(app.packageId).default
  // })
  // dynamicApps = allApps
}

export async function startAppLoadWatch() {
  await updateDefinitions()

  // watch for updates
  reaction(
    () => Desktop.state.workspaceState.packageIds,
    async () => {
      await updateDefinitions()
      __SERIOUSLY_SECRET.reloadAppDefinitions()
    },
  )
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
  LoadingApp,
  HomeApp,
]

export const getAllAppDefinitions = (): AppDefinition[] => {
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
        getLoadedApps: getAllAppDefinitions,
      })
    }
  })
}
