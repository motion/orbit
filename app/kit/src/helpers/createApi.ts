import { AppBit, CallAppBitApiMethodCommand } from '@o/models'
import { command } from '@o/bridge'

export function createApi<T>(): T {
  //  extends (app: AppBit) => any
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
