import { AppBit } from '@o/models'
import sum from 'hash-sum'
import { AppDefinition } from '../types/AppDefinition'
import { useAppBit } from './useAppBit'

// type ApiCall = AppWithDefinition & {
//   args: any[]
//   method: string
// }

type UnPromisifiedObject<T> = { [k in keyof T]: UnPromisify<T[k]> }
type UnPromisify<T> = T extends (...args: any[]) => Promise<infer U>
  ? (...args: any[]) => U
  : (...args: any[]) => T

// Once react-cache exists
// const AppApiResource = unstable_createResource(({ definition, app, method, args }: ApiCall) => {
//   return definition.api(app)[method](...args)
// })

const ApiCache = {}

export function useApp(): AppBit
export function useApp<A extends AppDefinition>(
  definition: A,
  app: AppBit,
): UnPromisifiedObject<ReturnType<A['api']>>
export function useApp(definition?: AppDefinition, app?: AppBit) {
  if (!definition) {
    return useAppBit()[0]
  }

  if (!app) {
    return null
  }

  // wraps any API method with a fake call that makes it Suspense-style
  return new Proxy(
    {},
    {
      get(_, method) {
        return (...args: any[]) => {
          const key = sum({ app, method, args })
          if (!ApiCache[key]) {
            const read = definition.api(app)[method](...args)

            ApiCache[key] = {
              read,
              response: null,
            }

            read
              .then(val => {
                ApiCache[key].response = val
              })
              .then(() => {
                // // clear cache
                // setTimeout(() => {
                //   delete ApiCache[key]
                // }, 100)
              })

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
