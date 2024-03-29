import { AppDefinition, createApp, getApps, useAppDefinitions } from '@o/kit'
import { Loading } from '@o/ui'
import React from 'react'

import AppsApp from './apps/AppsApp'
import BitApp from './BitApp'
import BitsApp from './BitsApp'
import ClipboardApp from './ClipboardApp'
import GraphApp from './GraphApp'
import MessageApp from './MessageApp'
import OnboardApp from './OnboardApp'
import QueryBuilderApp from './QueryBuilderApp'
import SearchResultsApp from './SearchResultsApp'
import SettingsApp from './settings/SettingsApp'
import SetupAppApp from './SetupAppApp'
import SpacesApp from './SpacesApp'

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
  GraphApp,
  QueryBuilderApp,
  SettingsApp,
  SpacesApp,
  AppsApp,
  BitApp,
  BitsApp,
  OnboardApp,
  SetupAppApp,
  MessageApp,
  LoadingApp,
  ClipboardApp,
  SearchResultsApp,
]

export const getAllAppDefinitions = (): AppDefinition[] => {
  return [...orbitStaticApps, ...getApps()]
}

const staticAppIdentifiers = orbitStaticApps.reduce((acc, cur) => {
  acc[cur.id] = true
  return acc
}, {})

export function getUserAppDefinitions(): AppDefinition[] {
  return getApps().filter(x => !staticAppIdentifiers[x.id])
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

// if (module['hot']) {
//   module['hot'].addStatusHandler(status => {
//     // remove webpack bad compile message after hmr
//     const iframe = document.querySelector('body > iframe')
//     iframe && iframe.remove()

//     // TODO may not be necessary anymore, check if HMR works without it
//     if (status === 'apply') {
//       configureKit({
//         StoreContext,
//       })
//     }
//   })
// }
