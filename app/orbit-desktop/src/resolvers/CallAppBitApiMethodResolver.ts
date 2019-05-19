import { resolveCommand } from '@o/mediator'
import { CallAppBitApiMethodCommand } from '@o/models'

import { OrbitAppsManager } from '../managers/OrbitAppsManager'

// const log = new Logger('command:call-app-bit-api-method')

export const createCallAppBitApiMethodResolver = (appsManager: OrbitAppsManager) => {
  return resolveCommand(
    CallAppBitApiMethodCommand,
    async ({ appId, appIdentifier, method, args }) => {
      appsManager
      appId
      appIdentifier
      method
      args
      return null
      // if (!apis[appIdentifier]) throw new Error(`No API for app "${appIdentifier}" was found`)

      // const app = await getRepository(AppEntity).findOneOrFail(appId)

      // const Create = apis[appIdentifier] as any
      // const api = Create.isClass ? new Create(app) : Create(app)

      // if (!api) throw new Error(`API for app "${appId}" is invalid`)
      // if (!api[method]) throw new Error(`No method "${method}" was found in the ${appId}" app`)

      // return api[method](...(args || []))
    },
  )
}
