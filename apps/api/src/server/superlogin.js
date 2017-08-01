import SL from 'superlogin'
// import { GitHubStrategy } from 'passport-github'
// import { GoogleStrategy } from 'passport-google-oauth'
// import { FacebookStrategy } from 'passport-facebook'
import SlackStrategy from './passportSlack'

console.log('strategy is', SlackStrategy)

export default class SuperLogin {
  constructor(config) {
    this.superlogin = new SL(config)

    const strategies = [
      ['slack', SlackStrategy],
      // ['facebook', FacebookStrategy],
      // ['github', GitHubStrategy],
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
