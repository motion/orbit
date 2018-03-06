import * as Constants from '~/constants'
import * as Injections from './injections'
import { throttle } from 'lodash'
import { store } from '@mcro/black/store'
import { App } from '@mcro/screen'

@store
export default class Auth {
  constructor({ socket }) {
    this.socket = socket
    this.listenForAuth()
  }

  listenForAuth() {
    const getAuthUrl = service => `${Constants.APP_URL}/auth?service=` + service
    const openAuthWindow = (e, service) =>
      Injections.openAuth(getAuthUrl(service))
    const closeAuthWindow = (e, service) =>
      Injections.closeChromeTabWithUrl(getAuthUrl(service))
    this.react(() => App.state.authOpen, throttle(openAuthWindow, 2000))
    this.react(() => App.state.authClose, throttle(closeAuthWindow, 2000))
  }
}
