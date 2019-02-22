import {
  DriveSource,
  GmailSource,
  SlackSource,
  SlackSourceValues,
  Source,
  SourceEntity,
  SourceType,
  SpaceEntity,
} from '@mcro/models'
import { DriveLoader, GMailLoader, SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'
import { OauthValues } from './oauthTypes'

export const finishAuth = (type: SourceType, values: OauthValues) => {
  createSource(type, values)
}

const createSource = async (type: SourceType, values: OauthValues) => {
  console.log('createSource', values)
  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }

  // temporary fix
  if ((type as any) === 'gdrive') {
    type = 'drive'
  }

  const source: Source = {
    spaces: [await getRepository(SpaceEntity).findOne(1)], // todo: we need to receive space id instead of hard codding it
    target: 'source',
    category: 'Source',
    identifier: type + (await getRepository(SourceEntity).count()), // adding count temporary to prevent unique constraint error
    type: type as any,
    token: values.token,
    values: {
      oauth: { ...values },
    } as any,
  }

  if (source.type === 'slack') {
    const loader = new SlackLoader(source as SlackSource)
    const team = await loader.loadTeam()

    // update settings with team info
    const values = source.values as SlackSourceValues
    values.team = {
      id: team.id,
      name: team.name,
      domain: team.domain,
      icon: team.icon.image_132,
    }
    source.name = team.name
  } else if (source.type === 'github') {
    source.name = values.info.username
  } else if (source.type === 'drive') {
    // load account info
    const loader = new DriveLoader(source as DriveSource)
    const about = await loader.loadAbout()
    source.name = about.user.emailAddress
  } else if (source.type === 'gmail') {
    // load account info
    const loader = new GMailLoader(source as GmailSource)
    const profile = await loader.loadProfile()
    source.name = profile.emailAddress
  }

  // check if we already have a source with the same name and type - then just ignore it
  const sourceWithSameName = await getRepository(SourceEntity).findOne({
    name: source.name,
    type: source.type,
  })
  if (!sourceWithSameName) {
    await getRepository(SourceEntity).save(source)
  }
}
