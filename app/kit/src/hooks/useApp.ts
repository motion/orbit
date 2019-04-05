import { AppBit } from '@o/models'
import { unstable_createResource } from 'react-cache'
import { AppDefinition } from '../types/AppDefinition'
import { AppWithDefinition } from './useActiveAppsWithDefinition'
import { useAppBit } from './useAppBit'

type ApiCall = AppWithDefinition & {
  args: any[]
  method: string
}

type UnPromisifiedObject<T> = { [k in keyof T]: UnPromisify<T[k]> }
type UnPromisify<T> = T extends Promise<infer U> ? U : T

const AppApiResource = unstable_createResource(({ definition, app, method, args }: ApiCall) => {
  return definition.api(app)[method](...args)
})

export function useApp(): AppBit
export function useApp<A extends AppDefinition>(
  definition: A,
  app: AppBit,
): UnPromisifiedObject<ReturnType<A['api']>>
export function useApp(definition?: AppDefinition, app?: AppBit) {
  if (!definition) {
    return useAppBit()[0]
  }

  return new Proxy(
    {},
    {
      get(_, method) {
        return (...args: any[]) => {
          if (!app) {
            return null
          }
          AppApiResource.read({
            app,
            definition,
            method,
            args,
          })
        }
      },
    },
  )

  return definition.api(app)
}
