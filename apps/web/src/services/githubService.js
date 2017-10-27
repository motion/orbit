// @flow
import Octokat from 'octokat'
import { store, watch } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class GithubService {
  github = null

  constructor() {
    this.react(
      () => (CurrentUser.user && CurrentUser.authorizations) || {},
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

  get setting(): ?string {
    return CurrentUser.setting.github
  }

  @watch allOrgs = () => this.github && this.github.user.orgs.fetchAll()

  get activeRepos() {
    return this.setting.values.repos
  }

  get activeOrgs() {
    return this.setting.orgs
  }
}
