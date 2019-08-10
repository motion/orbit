import { AppDefinition, configureKit, createApp, getApps, useAppDefinitions } from '@o/kit'
import { Desktop } from '@o/stores'
import { Loading } from '@o/ui'
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

export async function setupApps() {
  // writing our own little System loader
  const nameRegistry = Desktop.state.workspaceState.nameRegistry
  const appModules = await Promise.all(
    nameRegistry.map(async ({ buildName, entryPathRelative }) => {
      const appModule = await loadSystemModule(buildName, window)
      return appModule(entryPathRelative)
    }),
  )
  console.log('got', appModules)
}

async function loadSystemModule(name: string, modules: any): Promise<(path: string) => any> {
  return new Promise(res => {
    const { args, init } = window['System'].registry[name]
    const { setters, execute } = init(res)
    // adds the dependencies
    for (const [index, arg] of args.entries()) {
      setters[index](modules[arg])
    }
    execute()
  })
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
  return [...orbitStaticApps, ...getApps()]
}

export function getUserAppDefinitions(): AppDefinition[] {
  return getApps()
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
