import Octokat from 'octokat'
import { store, watch, react } from '@mcro/black'
import { CurrentUser } from '@mcro/models'

@store
export default class GithubService {
  github = null

  @react(true)
  githubSetting = [
    () => (CurrentUser.user && CurrentUser.authorizations) || {},
    ({ github }) => {
      if (github && !this.github) {
        this.github = new Octokat({
          token: github.token,
        })
      }
    },
  ]

  get setting() {
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
