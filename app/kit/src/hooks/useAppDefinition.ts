import { AppDefinition } from '@o/models'
import { isDefined } from '@o/utils'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { useReloadAppDefinitions } from './useReloadAppDefinitions'
import { useStores } from './useStores'

function createResource(fetch: any) {
  const cache = {}
  return {
    read: (...args) => {
      const key = JSON.stringify(args)

      console.log('reading', cache[key])

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

const ApiDefSearch = createResource((query: string) => {
  console.log('query', query)
  return fetch(`https://tryorbit.com/api/search/${query}`).then(res => res.json())
})

export function getSearchAppDefinitions(query: string | false) {
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

export function useAppDefinitionSearch(query?: string) {
  return getSearchAppDefinitions(query)
}
