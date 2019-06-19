import { downloadAppDefinition, requireAppDefinition } from '@o/cli'
import { newEmptyAppBit } from '@o/helpers'
import { Logger } from '@o/logger'
import { AppBit, AppEntity } from '@o/models'
import { getRepository } from 'typeorm'

import { getActiveSpace } from '../helpers/getActiveSpace'
import { OAuthStrategies } from './oauthStrategies'
import { OauthValues } from './oauthTypes'

const log = new Logger('finishAuth')
export const FinishAuthQueue = new Map()

export const finishAuth = async (type: string, values: OauthValues) => {
  try {
    log.info('createSource', values)

    if (!FinishAuthQueue.has(type)) {
      throw new Error(`No finish callback found in queue for ${type}`)
    }

    if (!values.token) {
      throw new Error(`No token returned ${JSON.stringify(values)}`)
    }

    log.info(`Downloading and loading app definition`)

    const downloaded = await downloadAppDefinition({
      packageId: '',
      directory: '',
    })

    if (downloaded.type === 'error') {
      throw new Error(`Couldn't download app definition: ${downloaded.message}`)
    }

    const required = await requireAppDefinition({
      packageId: '',
      directory: '',
    })

    if (required.type === 'error') {
      throw new Error(`Couldn't load app definition: ${required.message}`)
    }

    log.info(`Call finishAuth callback on app definition`)

    const space = await getActiveSpace()
    let app: AppBit = {
      ...newEmptyAppBit(required.definition),
      spaces: [space],
      spaceId: space.id,
      token: values.token,
      data: {
        values: {
          oauth: { ...values },
        },
      },
    }

    if (required.definition.finishAuth) {
      app = await required.definition.finishAuth(app, values, OAuthStrategies[type].config)
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

    const cb = FinishAuthQueue.get(type)
    if (cb) {
      FinishAuthQueue.delete(type)
      cb(true)
    } else {
      throw new Error(`No callback found for type ${type}`)
    }
  } catch (err) {
    log.error(`Error in finishAuth: ${err.message} ${err.stack}`)
    const cb = FinishAuthQueue.get(type)
    if (cb) {
      FinishAuthQueue.delete(type)
      cb(false)
    } else {
      log.info(`And no callback either..`)
    }
  }
}
