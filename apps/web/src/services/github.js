// @flow
import GithubAPI from 'github-api'
import { store } from '@mcro/black'
import type { CurrentUser } from '../stores/currentUserStore'

@store
export default class GithubService {
  token: ?string = null

  constructor(user: CurrentUser) {
    this.user = user

    this.watch(() => {
      if (user.github && !this.token) {
        this.token = user.github.auth.accessToken
        console.log('got a token', this.token)
      }
    })

    return new Proxy(this, {
      get(target, method) {
        if (method.indexOf('create') === 0) {
          // should trigger refresh in API
        }

        return target[method]
      },
    })
  }
}
