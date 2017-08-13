import SL from 'superlogin'
import { Strategy as GithubStrategy } from 'passport-github'
// import { GoogleStrategy } from 'passport-google-oauth'
import SlackStrategy from './passportSlack'

export default class SuperLogin {
  constructor(config) {
    this.superlogin = new SL(config)

    const strategies = [
      ['slack', SlackStrategy],
      ['github', GithubStrategy],
      // ['google', GoogleStrategy],
    ]

    strategies.forEach(([name, strategy]) => {
      if (
        this.superlogin.config.getItem(`providers.${name}.credentials.clientID`)
      ) {
        this.superlogin.registerOAuth2(name, strategy)
      }
    })
  }

  getUser(...args) {
    return this.superlogin.getUser(...args)
  }

  get router() {
    return this.superlogin.router
  }
}
