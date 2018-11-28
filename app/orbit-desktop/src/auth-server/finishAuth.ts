import { SourceEntity, SpaceEntity } from '@mcro/entities'
import {
  DriveSource,
  GmailSource,
  IntegrationType,
  SlackSource,
  SlackSourceValues,
  Source,
} from '@mcro/models'
import { DriveLoader, GMailLoader, SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'
import { OauthValues } from './oauthTypes'

export const finishAuth = (type: IntegrationType, values: OauthValues) => {
  createSource(type, values)
}

const createSource = async (type: IntegrationType, values: OauthValues) => {
  console.log('createSource', values)
  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }

  // temporary fix
  if ((type as any) === 'gdrive') {
    type = 'drive'
  }

  const setting: Source = {
    spaces: [await getRepository(SpaceEntity).findOne(1)], // todo: we need to receive space id instead of hard codding it
    target: 'source',
    category: 'integration',
    identifier: type + (await getRepository(SourceEntity).count()), // adding count temporary to prevent unique constraint error
    type: type as any,
    token: values.token,
    values: {
      oauth: { ...values },
    } as any,
  }

  if (setting.type === 'slack') {
    const loader = new SlackLoader(setting as SlackSource)
    const team = await loader.loadTeam()

    // update settings with team info
    const values = setting.values as SlackSourceValues
    values.team = {
      id: team.id,
      name: team.name,
      domain: team.domain,
      icon: team.icon.image_132,
    }
    setting.name = team.name
  } else if (setting.type === 'github') {
    setting.name = values.info.username
  } else if (setting.type === 'drive') {
    // load account info
    const loader = new DriveLoader(setting as DriveSource)
    const about = await loader.loadAbout()
    setting.name = about.user.emailAddress
  } else if (setting.type === 'gmail') {
    // load account info
    const loader = new GMailLoader(setting as GmailSource)
    const profile = await loader.loadProfile()
    setting.name = profile.emailAddress
  }

  await getRepository(SourceEntity).save(setting)
}
