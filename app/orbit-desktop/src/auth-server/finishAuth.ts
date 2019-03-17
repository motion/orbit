import { DriveLoader } from '@o/drive-app/_/DriveLoader' // todo(umed) fix it, we don't need to have desktop app dependency on apps
import { GMailLoader } from '@o/gmail-app/_/GMailLoader' // todo(umed) fix it, we don't need to have desktop app dependency on apps
import { AppBit, AppEntity, SpaceEntity, UserEntity } from '@o/models'
import { SlackLoader } from '@o/slack-app/_/SlackLoader' // todo(umed) fix it, we don't need to have desktop app dependency on apps
import { getRepository } from 'typeorm'
import { OauthValues } from './oauthTypes'

export const finishAuth = (type: string, values: OauthValues) => {
  createSource(type, values)
}

const createSource = async (type: string, values: OauthValues) => {
  console.log('createSource', values)

  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }

  const user = await getRepository(UserEntity).findOne({})
  const space = await getRepository(SpaceEntity).findOne({ where: { id: user.activeSpace } })
  const app: AppBit = {
    target: 'app',
    // todo: we need to receive space id instead of hard codding it
    spaces: [space],
    spaceId: space.id,
    identifier: type,
    token: values.token,
    data: {
      values: {
        oauth: { ...values },
      } as any,
    },
  }

  if (app.identifier === 'slack') {
    const loader = new SlackLoader(app)
    const team = await loader.loadTeam()

    // update settings with team info
    const values = app.data.values as any
    values.team = {
      id: team.id,
      name: team.name,
      domain: team.domain,
      icon: team.icon.image_132,
    }
    app.name = team.name
  } else if (app.identifier === 'github') {
    app.name = values.info.username
  } else if (app.identifier === 'drive') {
    // load account info
    const loader = new DriveLoader(app)
    const about = await loader.loadAbout()
    app.name = about.user.emailAddress
  } else if (app.identifier === 'gmail') {
    // load account info
    const loader = new GMailLoader(app)
    const profile = await loader.loadProfile()
    app.name = profile.emailAddress
  }

  // TODO @umed i think this got a bit confusing in refactor
  // I made AppBit.identifier, but its doing something different
  // it's now the "package" identifier basically, so if i publish app its "myapp.someid"
  // I added a AppBit.sourceIdentifier to be like the old Source.identifier, but
  // need to redo this area (and probably other areas) finish migration

  // check if we already have a source with the same name and type - then just ignore it
  const sourceWithSameName = await getRepository(AppEntity).findOne({
    name: app.name,
    identifier: app.identifier,
  })

  if (sourceWithSameName) {
    console.warn('we have source with same name')
  }

  if (!sourceWithSameName) {
    await getRepository(AppEntity).save(app)
  }
}
