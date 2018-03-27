import * as Constants from '~/constants'
import * as Injections from '~/helpers/injections'
import { throttle } from 'lodash'
import { store, react } from '@mcro/black/store'
import { App } from '@mcro/all'

const getAuthUrl = service => `${Constants.APP_URL}/auth?service=` + service
const openAuthWindow = (e, service) =>
  Injections.openAuth(getAuthUrl(service))
const closeAuthWindow = (e, service) =>
  Injections.closeChromeTabWithUrl(getAuthUrl(service))

@store
export default class Auth {
  @react openAuthWindow = [
    () => App.state.authOpen,
    throttle(openAuthWindow, 2000)
  ]

  @react closeAuthWindow = [
    () => App.state.authClose,
    throttle(closeAuthWindow, 2000)
  ]
}
