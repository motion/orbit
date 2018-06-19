import { Setting } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import * as Constants from '../constants'
import * as r2 from '@mcro/r2'
import debug from '@mcro/debug'
import invariant from 'invariant'

const log = debug('OauthActions')

export const checkAuths = async () => {
  const { error, ...authorizations } = await r2.get(
    `${Constants.API_URL}/getCreds`,
  ).json
  if (error) {
    console.log('no creds', error)
  }
  return authorizations
}

export const startOauth = type => {
  log(`Start oauth ${type}`)
  invariant(typeof type === 'string', 'Type is not a string')
  App.sendMessage(Desktop, Desktop.messages.OPEN_AUTH, type)
  const checker = setInterval(async () => {
    const auth = await checkAuths()
    const oauth = (auth && auth[type]) || {}
    if (!oauth) return
    clearInterval(checker)
    if (!oauth.token) {
      console.log('got', auth)
      throw new Error(`No token returned ${JSON.stringify(oauth)}`)
    }
    const setting = new Setting()
    setting.category = 'integration'
    setting.type = type
    setting.token = oauth.token
    setting.values = {
      ...setting.values,
      oauth: { ...oauth },
    }
    await setting.save()
    App.sendMessage(Desktop, Desktop.messages.CLOSE_AUTH, type)
    // show settings again
    App.sendMessage(App, App.messages.TOGGLE_SETTINGS)
  }, 1000)
}
