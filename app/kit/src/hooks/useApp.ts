import { isEqual } from '@o/fast-compare'
import { AppBit, AppDefinition } from '@o/models'
import { useForceUpdate } from '@o/use-store'
import { useEffect, useRef } from 'react'

import { useAppBit } from './useAppBit'

export type UnPromisifiedObject<T> = { [k in keyof T]: UnPromisify<T[k]> }
export type UnPromisify<T> = T extends (...args: any[]) => Promise<infer U>
  ? (...args: any[]) => U
  : (...args: any[]) => T

const ApiCache = {}

/**
 * TODO this probably should be names useApi,
 * OR we should do useApp().api and have other information there to
 * ALSO the automatic-suspsense should be an option
 */

export function useApp(): AppBit
export function useApp<A extends AppDefinition>(
  definition: A,
  // if empty, will use the first available in the workspace
  // we eventually prompt them to choose which they'd like
  app?: AppBit,
): UnPromisifiedObject<A['api'] extends Function ? ReturnType<A['api']> : undefined>
export function useApp(definition?: AppDefinition, userApp?: AppBit) {
  const shouldCheckUpdate = useRef<any>(null)
  const forceUpdate = useForceUpdate()
  const [firstApp] = useAppBit(definition ? { identifier: definition.id } : false)
  const app = userApp || firstApp

  useEffect(() => {
    if (!shouldCheckUpdate.current) return
    if (!app) {
      console.warn('no app found')
      return
    }
    if (!definition || !definition.api) {
      console.warn('no def or api')
      return
    }
    let cancel = false

    const { key, method, args } = shouldCheckUpdate.current

    // check for any updated val
    definition
      .api(app)
      [method](...args)
      .then(val => {
        if (cancel) return
        if (!isEqual(ApiCache[key].response, val)) {
          ApiCache[key].response = val
          forceUpdate()
        }
      })
      .catch(err => {
        console.error(err)
      })

    return () => {
      cancel = true
    }
  }, [app, shouldCheckUpdate])

  if (!definition || !definition.api) {
    return useAppBit()[0]
  }
  if (!app) {
    return null
  }

  const apiMethods = definition.api(app)

  // wraps any API method with a fake call that makes it Suspense-style
  return new Proxy(
    // make them easy to see in repl
    { ...apiMethods },
    {
      get(_, method) {
        return (...args: any[]) => {
          const key = stringHash(JSON.stringify({ method, args }))

          if (ApiCache[key]) {
            shouldCheckUpdate.current = { method, args, key }
          } else {
            const rawRead = definition!.api!(app)[method](...args)
            const read = rawRead
              .then(val => {
                ApiCache[key].response = val
              })
              .catch(err => {
                console.error('Error in useApp call', err)
                ApiCache[key].response = null
              })

            ApiCache[key] = {
              at: Date.now(),
              read,
              response: null,
            }

            throw ApiCache[key].read
          }

          if (!ApiCache[key].response) {
            throw ApiCache[key].read
          }

          if (ApiCache[key].response) {
            return ApiCache[key].response
          }
        }
      },
    },
  )
}

function stringHash(str: string): number {
  // thx darksky: https://git.io/v9kWO
  let res = 5381
  let i = str.length
  while (i) {
    res = (res * 33) ^ str.charCodeAt(--i)
  }
  return res >>> 0
}
