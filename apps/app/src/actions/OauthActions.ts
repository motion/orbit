import { Setting } from '@mcro/models'
import { App, Desktop } from '@mcro/all'
import * as Constants from '../constants'
import * as r2 from '@mcro/r2'

export const checkAuths = async () => {
  const { error, ...authorizations } = await r2.get(
    `${Constants.API_URL}/getCreds`,
  ).json
  if (error) {
    console.log('no creds')
  }
  return authorizations
}

export const startOauth = type => {
  App.sendMessage(Desktop, Desktop.messages.OPEN_AUTH, type)
  const checker = setInterval(async () => {
    const auth = await checkAuths()
    const oauth = auth && auth[type]
    if (!oauth) return
    clearInterval(checker)
    if (!oauth.token) {
      throw new Error(`No token returned ${JSON.stringify(oauth)}`)
    }
    const setting = new Setting()
    setting.category = 'integration'
    setting.type = type
    setting.token = oauth.token
    setting.values = {
      ...setting.values,
      oauth,
    }
    await setting.save()
    // updateSettings()
    App.sendMessage(Desktop, Desktop.messages.CLOSE_AUTH, type)
    // show settings again
    App.sendMessage(App, App.messages.TOGGLE_SETTINGS)
  }, 1000)
}
