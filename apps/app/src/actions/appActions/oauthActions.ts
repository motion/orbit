import { Setting } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import * as Constants from '../../constants'
import * as r2 from '@mcro/r2'
import debug from '@mcro/debug'
import invariant from 'invariant'

const log = debug('OauthActions')

export const checkAuths = async () => {
  const { error, ...authorizations } = await r2.get(
    `${Constants.API_URL}/getCreds`,
  ).json
  if (error) {
    if (error === 'no creds') {
      return
    }
    throw new Error(error)
  }
  return authorizations
}

export const startOauth = type => {
  log(`Start oauth ${type}`)
  invariant(typeof type === 'string', 'Type is not a string')
  App.sendMessage(Desktop, Desktop.messages.OPEN_AUTH, type)
  const checker = setInterval(async () => {
    const auth = await checkAuths()
    const oauth = auth && auth[type]
    if (!oauth) {
      return
    }
    clearInterval(checker)
    if (!oauth.token) {
      console.log('got', auth)
      throw new Error(`No token returned ${JSON.stringify(oauth)}`)
    }
    // todo: have a resolver for identifiers based on integration
    const oauthid = (oauth.info && oauth.info.id) || 'none'
    const identifier = `${oauthid}-${type}`
    let setting
    // update if its the same identifier from the oauth
    if (identifier) {
      setting = await Setting.findOne({ identifier })
    }
    if (!setting) {
      setting = new Setting()
    }
    setting.category = 'integration'
    setting.identifier = identifier
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
