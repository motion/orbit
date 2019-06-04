import { command } from '@o/bridge'
import { AppBit, CallAppBitApiMethodCommand } from '@o/models'

export interface FunctionalAPI<X> {
  (appBit: AppBit): X
  isClass?: undefined
}

export interface ClassAPI<X> {
  new (app: AppBit): X
  isClass: boolean
}

type APIReturn<X> = X extends ClassAPI<infer A> ? A : X extends FunctionalAPI<infer A> ? A : never

export function createApi<T extends FunctionalAPI<any> | ClassAPI<any>>(
  _api: T,
): (app: AppBit) => APIReturn<T> {
  const fn = (app: AppBit) =>
    new Proxy(
      {},
      {
        get(_target, method) {
          return (...args) => {
            return command(CallAppBitApiMethodCommand, {
              appId: app.id,
              appIdentifier: app.identifier,
              method,
              args,
            })
          }
        },
      },
    )

  return fn as any
}
