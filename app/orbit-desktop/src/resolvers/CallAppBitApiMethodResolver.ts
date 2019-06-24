import { OrbitAppsManager } from '@o/libs-node'
import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppEntity, CallAppBitApiMethodCommand } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('command:call-app-bit-api-method')

export const createCallAppBitApiMethodResolver = (appsManager: OrbitAppsManager) => {
  return resolveCommand(
    CallAppBitApiMethodCommand,
    async ({ appId, appIdentifier, method, args }) => {
      const app = await getRepository(AppEntity).findOneOrFail(appId)
      const api = appsManager.nodeAppDefinitions.find(x => x.id === appIdentifier).api(app)
      if (!api) throw new Error(`API for app "${appId}" is invalid`)
      if (!api[method]) throw new Error(`No method "${method}" was found in the ${appId}" app`)

      log.info(
        `Calling api for app ${appIdentifier} id ${appId} method ${method} args ${JSON.stringify(
          args,
        )}`,
      )

      return await Promise.resolve(api[method](...args))
    },
  )
}
