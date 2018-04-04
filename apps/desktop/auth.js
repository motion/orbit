import * as Constants from '~/constants'
import * as Injections from '~/helpers/injections'
import { throttle } from 'lodash'
import { store, react } from '@mcro/black/store'
import { App } from '@mcro/all'

const getAuthUrl = id => `${Constants.APP_URL}/auth?service=` + id

@store
export default class Auth {
  @react
  openAuthWindow = [
    () => App.authState.openId,
    throttle(id => {
      if (!id) {
        return
      }
      console.log('opening auth for', id)
      Injections.openAuth(getAuthUrl(id))
    }, 2000),
  ]

  @react
  closeAuthWindow = [
    () => App.authState.closeId,
    throttle(id => {
      Injections.closeChromeTabWithUrl(getAuthUrl(id))
    }, 2000),
  ]
}
