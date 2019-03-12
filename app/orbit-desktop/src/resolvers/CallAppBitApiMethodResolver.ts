import { resolveCommand } from '@o/mediator'
import { AppEntity, CallAppBitApiMethodCommand } from '@o/models'
import { apis } from '@o/apps/_/apis'
import { getRepository } from 'typeorm'

// const log = new Logger('command:call-app-bit-api-method')

export const CallAppBitApiMethodResolver = resolveCommand(CallAppBitApiMethodCommand, async ({ appId, appIdentifier, method, args }) => {

  if (!apis[appIdentifier])
    throw new Error(`No API for app "${appId}" was found`)
  if (!apis[appIdentifier][method])
    throw new Error(`No method "${method}" was found in the ${appId}" app`)

  const app = await getRepository(AppEntity).findOneOrFail(appId)
  return apis[appIdentifier][method](app, ...(args || []))
})
