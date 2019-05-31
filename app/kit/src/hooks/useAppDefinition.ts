import { command } from '@o/bridge'
import { ApiSearchItem, AppDefinition, GetAppStoreAppDefinitionCommand } from '@o/models'
import { isDefined } from '@o/utils'
import { useEffect, useState, useRef } from 'react'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { useReloadAppDefinitions } from './useReloadAppDefinitions'
import { useStores } from './useStores'
import { SearchableTopBar } from '@o/ui'

function createResource(fetch: any) {
  const cache = {}
  return {
    read: (...args) => {
      const key = JSON.stringify(args)

      if (cache[key]) {
        if (isDefined(cache[key].value)) {
          return cache[key].value
        } else {
          throw cache[key].read
        }
      }

      cache[key] = {
        value: undefined,
        read: new Promise(res => {
          fetch(...args)
            .then(x => {
              cache[key].value = x
              res()
            })
            .catch(err => {
              cache[key].value = null
              console.error(err)
              res()
            })
        }),
      }

      throw cache[key].read
    },
  }
}

const ApiDefSearch = createResource((identifier: string) => {
  console.log('identifier', identifier)
  return fetch(`https://tryorbit.com/api/apps/${identifier}`).then(res => res.json())
})

export function getSearchAppDefinitions(query: string | false): ApiSearchItem | null {
  if (query === false) {
    return null
  }
  return ApiDefSearch.read(query)
}

export function useAppDefinition(identifier?: string): AppDefinition {
  useReloadAppDefinitions()
  const { appStore } = useStores()
  return getAppDefinition(identifier || appStore.identifier)
}

export function useAppDefinitionFromStore(identifier?: string | false): AppDefinition {
  const searchedApp = getSearchAppDefinitions(identifier)
  return !identifier
    ? null
    : {
        id: searchedApp.identifier,
        icon: searchedApp.icon,
        name: searchedApp.name,
        description: searchedApp.description,
        api: !!searchedApp.features.some(x => x === 'api') ? _ => _ : null,
        graph: !!searchedApp.features.some(x => x === 'graph') ? _ => _ : null,
        sync: !!searchedApp.features.some(x => x === 'sync') ? true : false,
      }
}

export function useAppStoreInstalledAppDefinition(
  identifier?: string | false,
  options?: { onStatus: (message: string | false) => any },
) {
  const searchedApp = getSearchAppDefinitions(identifier)
  // start out with the searched app to load quickly
  const [reply, setReply] = useState<AppDefinition | { error: string }>(null)
  const tm = useRef(null)

  // then install the app definition and have it ready for use in setup validation
  useEffect(() => {
    if (!identifier) return
    let cancel = false
    command(GetAppStoreAppDefinitionCommand, { packageId: searchedApp.packageId })
      .then(res => {
        clearTimeout(tm.current)
        options && options.onStatus(false)
        if (!cancel) {
          setReply(res)
        }
      })
      .catch(error => {
        clearTimeout(tm.current)
        options && options.onStatus(false)
        if (!cancel) {
          setReply({ error })
        }
      })
    return () => {
      cancel = true
    }
  }, [])

  // show some nice messages during install
  useEffect(() => {
    if (!identifier) return
    if (options) {
      options.onStatus('Installing...')
      tm.current = setTimeout(() => {
        options.onStatus('Downloading dependencies...')
        tm.current = setTimeout(() => {
          options.onStatus('Slow network or large package, still installing...')
          tm.current = setTimeout(() => {
            options.onStatus('Compiling dependencies...')
          }, 8000)
        }, 4000)
      }, 3000)
    }
    return () => clearTimeout(tm.current)
  }, [])

  return reply
}
