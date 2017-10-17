// @flow
import Octokat from 'octokat'
import { store, watch } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class GithubService {
  github = null

  get setting(): ?string {
    return CurrentUser.setting.github
  }

  constructor() {
    this.react(
      () => (CurrentUser.user && CurrentUser.user.authorizations) || {},
      ({ github }) => {
        if (github && !this.github) {
          this.github = new Octokat({
            token: github.token,
          })
        }
      },
      true
    )
  }

  @watch
  orgs = async () => {
    if (!this.setting || !this.github) {
      return null
    }
    const orgs = await this.github.user.orgs.fetchAll()
    if (orgs.message) {
      console.error('orgs.message', orgs.message)
      return null
    }
    return orgs
  }
}
