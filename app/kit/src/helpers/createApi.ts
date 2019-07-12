import { command } from '@o/bridge'
import { AppBit, CallAppBitApiMethodCommand } from '@o/models'

export interface FunctionalAPI<X> {
  (appBit: AppBit): X
}

export function createApi<T extends FunctionalAPI<any>>(
  _api: T,
): (app: AppBit) => FunctionalAPI<T> {
  const fn = (app: AppBit) =>
    new Proxy(
      {},
      {
        get(_target, method) {
          return (...args) => {
            console.log('command', command, require('@o/bridge'))
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
