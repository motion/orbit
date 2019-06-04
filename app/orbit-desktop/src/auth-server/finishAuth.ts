import { downloadAppDefinition, requireAppDefinition } from '@o/cli'
import { AppBit, AppEntity, SpaceEntity, UserEntity } from '@o/models'
import { getRepository } from 'typeorm'

import { OauthValues } from './oauthTypes'

// TODO nate dynamic loading
// import OAuthStrategies from './oauthStrategies'
// import { DriveLoader } from '@o/drive-app/_/DriveLoader'
// import { GMailLoader } from '@o/gmail-app/_/GMailLoader'
// import { SlackLoader } from '@o/slack-app/_/SlackLoader'
// import { GmailAppData } from '@o/gmail-app/_/GMailModels'
// import { DriveAppData } from '@o/drive-app/_/DriveModels'

export const finishAuth = async (type: string, values: OauthValues) => {
  console.log('createSource', values)

  if (!values.token) {
    throw new Error(`No token returned ${JSON.stringify(values)}`)
  }

  const user = await getRepository(UserEntity).findOne({})
  const space = await getRepository(SpaceEntity).findOne({ where: { id: user.activeSpace } })
  let app: AppBit = {
    target: 'app',
    name: '',
    spaces: [space],
    spaceId: space.id,
    identifier: type,
    token: values.token,
    data: {
      values: {
        oauth: { ...values },
      },
    },
  }

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

  app = await required.definition.finishAuth(app, values)

  // if (app.identifier === 'slack') {
  //   const loader = new SlackLoader(app)
  //   const team = await loader.loadTeam()

  //   // update settings with team info
  //   const values = app.data.values as any
  //   values.team = {
  //     id: team.id,
  //     name: team.name,
  //     domain: team.domain,
  //     icon: team.icon.image_132,
  //   }
  //   app.name = team.name
  // } else if (app.identifier === 'github') {
  //   app.name = values.info.username
  // } else if (app.identifier === 'drive') {
  //   // load account info
  //   const loader = new DriveLoader(app)
  //   const about = await loader.loadAbout()
  //   app.name = about.user.emailAddress
  //   ;(app.data as DriveAppData).values.oauth.secret =
  //     OAuthStrategies.drive.config.credentials.clientSecret
  //   ;(app.data as DriveAppData).values.oauth.clientId =
  //     OAuthStrategies.drive.config.credentials.clientID
  // } else if (app.identifier === 'gmail') {
  //   // load account info
  //   const loader = new GMailLoader(app)
  //   const profile = await loader.loadProfile()
  //   app.name = profile.emailAddress
  //   ;(app.data as GmailAppData).values.oauth.secret =
  //     OAuthStrategies.gmail.config.credentials.clientSecret
  //   ;(app.data as GmailAppData).values.oauth.clientId =
  //     OAuthStrategies.gmail.config.credentials.clientID
  // }

  await getRepository(AppEntity).save(app)
}
