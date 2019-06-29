import { command } from '@o/bridge'
import { ApiSearchItem, AppDefinition, GetAppStoreAppDefinitionCommand } from '@o/models'
import { isDefined } from '@o/utils'
import { useEffect, useRef, useState } from 'react'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { useReloadAppDefinitions } from './useReloadAppDefinitions'
import { useStores } from './useStores'

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

export function useAppDefinition(identifier?: string | false): AppDefinition {
  useReloadAppDefinitions()
  const { appStore } = useStores()
  if (identifier === false) {
    return null
  }
  return getAppDefinition(identifier || appStore.identifier)
}

export function useAppDefinitionFromStore(identifier?: string | false): AppDefinition {
  const searchedApp = getSearchAppDefinitions(identifier)
  return !identifier || !searchedApp
    ? null
    : {
        id: searchedApp.identifier,
        icon: searchedApp.icon,
        name: searchedApp.name,
        description: searchedApp.description,
        api: !!searchedApp.features.some(x => x === 'api') ? _ => _ : null,
        graph: !!searchedApp.features.some(x => x === 'graph') ? _ => _ : null,
        workers: !!searchedApp.features.some(x => x === 'workers') ? [] : undefined,
        setup: searchedApp.setup,
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

    command(
      GetAppStoreAppDefinitionCommand,
      { packageId: searchedApp.packageId },
      { timeout: 50000 },
    )
      .then(res => {
        clearTimeout(tm.current)
        options && options.onStatus(false)
        if (!cancel) {
          console.log('success, import real app definition', res)
          // setReply(res)
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
  }, [identifier])

  // show some nice messages during install
  useEffect(() => {
    if (!identifier) return
    if (options) {
      options.onStatus('Fetching app definition for validation...')
      tm.current = setTimeout(() => {
        options.onStatus('Getting app definition dependencies...')
        tm.current = setTimeout(() => {
          options.onStatus('Slow network or large package, still fetching...')
          tm.current = setTimeout(() => {
            options.onStatus('Setting up app definition...')
          }, 8000)
        }, 4000)
      }, 3000)
    }
    return () => clearTimeout(tm.current)
  }, [identifier])

  return reply
}
