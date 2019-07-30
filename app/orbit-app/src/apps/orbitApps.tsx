import { __SERIOUSLY_SECRET, AppDefinition, configureKit, createApp, useAppDefinitions } from '@o/kit'
import { Desktop } from '@o/stores'
import { Loading } from '@o/ui'
import { reaction } from 'mobx'
import React from 'react'

import { StoreContext } from '../StoreContext'
import AppsApp from './apps/AppsApp'
import BitApp from './BitApp'
import ClipboardApp from './ClipboardApp'
import MessageApp from './MessageApp'
import OnboardApp from './OnboardApp'
import QueryBuilderApp from './QueryBuilderApp'
import SearchResultsApp from './SearchResultsApp'
import SettingsApp from './settings/SettingsApp'
import SetupAppApp from './SetupAppApp'
import SpacesApp from './SpacesApp'

let dynamicApps: AppDefinition[] = []

updateDefinitions()

function updateDefinitions() {
  dynamicApps = []
  for (let i = 0; i < 1000; i++) {
    const app = window[`LoadOrbitApp_${i}`]
    if (app) {
      console.log('got app', app)
    } else {
      break
    }
  }
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
  app: () => {
    return <Loading />
  },
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
  ClipboardApp,
  SearchResultsApp,
]

export const getAllAppDefinitions = (): AppDefinition[] => {
  return [...orbitStaticApps, ...dynamicApps]
}

export function getUserAppDefinitions(): AppDefinition[] {
  return dynamicApps
}

export function useStaticAppDefinitions() {
  return orbitStaticApps
}

// refreshes when they change
export function useUserAppDefinitions() {
  useAppDefinitions() // this triggers update on app defs update
  return getUserAppDefinitions()
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
