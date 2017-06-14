import SuperLogin from 'superlogin'
import { GitHubStrategy } from 'passport-github'
import { GoogleStrategy } from 'passport-google-oauth'
import { FacebookStrategy } from 'passport-facebook'

export default class Login {
  constructor(config) {
    this.superlogin = new SuperLogin(config)

    // const strategies = []
    // ['facebook', FacebookStrategy],
    // ['github', GitHubStrategy],
    // ['google', GoogleStrategy],
    // strategies.forEach(([name, strategy]) => {
    //   if (
    //     this.superlogin.config.getItem(`providers.${name}.credentials.clientID`)
    //   ) {
    //     this.superlogin.registerOAuth2(name, strategy)
    //   }
    // })
  }

  get router() {
    return this.superlogin.router
  }
}
