import * as Constants from '~/constants'
import * as Injections from '~/helpers/injections'
import { Desktop } from '@mcro/stores'
import open from 'opn'

const getAuthUrl = id => `${Constants.API_URL}/auth?service=` + id

export class Auth {
  constructor() {
    Desktop.onMessage(Desktop.messages.OPEN_AUTH, type => {
      console.log('got message', type)
      open(getAuthUrl(type))
    })
    Desktop.onMessage(Desktop.messages.CLOSE_AUTH, type => {
      Injections.closeChromeTabWithUrl(getAuthUrl(type))
    })
  }
}
