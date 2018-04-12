import * as Constants from '~/constants'
import * as Injections from '~/helpers/injections'
import { throttle } from 'lodash'
import { store, react } from '@mcro/black/store'
import { App } from '@mcro/all'
import open from 'opn'

const getAuthUrl = id => `${Constants.APP_URL}/auth?service=` + id

@store
export default class Auth {
  @react
  openAuthWindow = [
    () => App.authState.openId,
    throttle(id => {
      if (!id) return
      open(getAuthUrl(id))
    }, 1000),
  ]

  @react
  closeAuthWindow = [
    () => App.authState.closeId,
    throttle(id => {
      Injections.closeChromeTabWithUrl(getAuthUrl(id))
    }, 1000),
  ]
}
