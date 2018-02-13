import * as Constants from '~/constants'
import * as Injections from './injections'
import * as Helpers from '~/helpers'
import { throttle } from 'lodash'
import { store } from '@mcro/black/store'

@store
export default class Auth {
  constructor({ socket }) {
    this.socket = socket
    this.listenForAuth()
    this.listenForOpenBrowser()
    this.listenForCrawlerInject()
  }

  listenForAuth() {
    const getAuthUrl = service => `${Constants.APP_URL}/auth?service=` + service
    const openAuthWindow = (e, service) =>
      Injections.openAuth(getAuthUrl(service))
    const closeAuthWindow = (e, service) =>
      Injections.closeChromeTabWithUrl(getAuthUrl(service))
    this.on(this.socket, 'auth-open', throttle(openAuthWindow, 2000))
    this.on(this.socket, 'auth-close', throttle(closeAuthWindow, 2000))
  }

  listenForOpenBrowser() {
    // this.on(
    //   this.socket,
    //   'open-browser',
    //   throttle((event, url) => Helpers.open(url), 200),
    // )
  }

  listenForCrawlerInject() {
    // this.on(
    //   this.socket,
    //   'inject-crawler',
    //   throttle(Injections.injectCrawler, 1000),
    // )
    // this.on(
    //   this.socket,
    //   'uninject-crawler',
    //   throttle(Injections.uninjectCrawler, 1000),
    // )
  }

  handleOpenSettings() {
    // this.on(this.socket, 'open-settings', throttle(this.handlePreferences, 200))
  }
}
