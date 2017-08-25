// @flow
import GithubAPI from 'github-api'
import { store } from '@mcro/black'
import type { CurrentUser } from '../stores/currentUserStore'

@store
export default class GithubService {
  constructor(user: CurrentUser) {
    this.user = user

    return new Proxy(this, {
      get(target, method) {
        if (method.indexOf('create') === 0) {
          // should trigger refresh in API
        }

        return target[method]
      },
    })
  }

  get token() {
    return this.user.github && this.user.github.auth.accessToken
  }
}
