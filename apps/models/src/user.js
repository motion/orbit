// @flow
import { store } from '@jot/black'
import AuthStore from './authStore'

@store
class User {
  auth = new AuthStore()

  get user() {
    return this.auth.user
  }

  get loggedIn() {
    return !!this.auth.user
  }

  get name() {
    return this.user.name
  }

  get authorId() {
    return (this.loggedIn && this.user.name) || 'anon'
  }
}

export default new User()
