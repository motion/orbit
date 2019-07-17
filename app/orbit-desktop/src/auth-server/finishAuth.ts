import { downloadAppDefinition, getPackageId, requireAppDefinition } from '@o/cli'
import { newEmptyAppBit } from '@o/libs'
import { Logger } from '@o/logger'
import { AppBit, AppEntity } from '@o/models'
import { getRepository } from 'typeorm'

import { getActiveSpace } from '../helpers/getActiveSpace'
import { getCurrentWorkspace } from '../resolvers/AppOpenWorkspaceResolver'
import { OAuthStrategies } from './oauthStrategies'
import { OauthValues } from './oauthTypes'

const log = new Logger('finishAuth')

// maps authKey to information needed for finishing creating AppBit
export const FinishAuthQueue = new Map<
  string,
  {
    identifier: string
    finish: (res: boolean) => any
  }
>()

export const finishAuth = async (type: string, values: OauthValues) => {
  try {
    log.info('createSource', values)

    if (!FinishAuthQueue.has(type)) {
      throw new Error(`No finish callback found in queue for ${type}`)
    }

    if (!values.token) {
      throw new Error(`No token returned ${JSON.stringify(values)}`)
    }

    const info = FinishAuthQueue.get(type)

    if (!info) {
      return {
        type: 'error' as const,
        message: `No information found for this app, an error in Orbit occured for authKey: ${type}`,
      }
    }

    const packageId = await getPackageId(info.identifier)
    const { directory } = await getCurrentWorkspace()

    if (!packageId || !directory) {
      return {
        type: 'error' as const,
        message: `No packageId or directory, error in Orbit: (${packageId}, ${directory})`,
      }
    }

    log.info(`Downloading (if necessary) and loading app definition (packageId: ${packageId})`)

    const downloaded = await downloadAppDefinition({
      packageId,
      directory,
    })

    if (downloaded.type === 'error') {
      throw new Error(`Couldn't download app definition: ${downloaded.message}`)
    }

    const required = await requireAppDefinition({
      packageId,
      directory,
      // since were running it here in node
      types: ['node'],
    })

    if (required.type === 'error') {
      throw new Error(`Couldn't load app definition: ${required.message}`)
    }

    log.info(`Call finishAuth callback on app definition`)

    const space = await getActiveSpace()
    let app: AppBit = {
      ...newEmptyAppBit(required.value),
      spaces: [space],
      spaceId: space.id,
      token: values.token,
      data: {
        values: {
          oauth: { ...values },
        },
      },
    }

    if (required.value.finishAuth) {
      app = await required.value.finishAuth(app, values, OAuthStrategies[type].config)
      if (!app || typeof app !== 'object') {
        return {
          type: 'error' as const,
          message: `App.finishAuth does not return an AppBit`,
        }
      }
    }

    await getRepository(AppEntity).save(app)

    // finish in the queue
    log.info(`Call back to command`)
    FinishAuthQueue.delete(type)
    info.finish(true)
  } catch (err) {
    log.error(`Error in finishAuth: ${err.message} ${err.stack}`)

    const info = FinishAuthQueue.get(type)
    if (info) {
      FinishAuthQueue.delete(type)
      info.finish(false)
    } else {
      log.info(`And no callback either..`)
    }
  }
}
