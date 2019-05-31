import { command } from '@o/bridge'
import { ApiSearchItem, AppDefinition, GetAppStoreAppDefinitionCommand } from '@o/models'
import { isDefined } from '@o/utils'
import { useEffect, useState } from 'react'

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

export function useAppDefinition(identifier?: string): AppDefinition {
  useReloadAppDefinitions()
  const { appStore } = useStores()
  return getAppDefinition(identifier || appStore.identifier)
}

export function useAppDefinitionFromStore(
  query?: string,
  options?: { onStatus: (message: string) => any },
): AppDefinition {
  const searchedApp = getSearchAppDefinitions(query)

  // show some nice messages during install
  useEffect(() => {
    let tm
    if (options) {
      options.onStatus('Installing...')
      tm = setTimeout(() => {
        options.onStatus('Downloading dependencies...')
        tm = setTimeout(() => {
          options.onStatus('Slow network or large package, still installing...')
          tm = setTimeout(() => {
            options.onStatus('Compiling dependencies...')
          }, 8000)
        }, 4000)
      }, 3000)
    }
    return () => clearTimeout(tm)
  }, [])

  if (!searchedApp) {
    return null
  }
  return useTempAppPackage(searchedApp.packageId)
}

function useTempAppPackage(packageId: string) {
  const [reply, setReply] = useState(null)

  useEffect(() => {
    let cancel = false
    command(GetAppStoreAppDefinitionCommand, { packageId })
      .then(res => {
        if (!cancel) {
          setReply(res)
        }
      })
      .catch(error => {
        if (!cancel) {
          setReply({ error })
        }
      })
    return () => {
      cancel = true
    }
  }, [])

  return reply
}
