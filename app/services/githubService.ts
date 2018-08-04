import { Setting } from '@mcro/models'
import { store, react } from '@mcro/black/store'
import Octokat from 'octokat'

@store
export class GithubService {
  setting: Setting
  github = null

  constructor(setting) {
    this.setting = setting
    this.github = new Octokat({
      token: this.setting.token,
    })
  }

  allOrgs = react(() => this.github && this.github.user.orgs.fetchAll(), {
    immediate: true,
  })

  get activeRepos() {
    if (!this.setting) return
    return this.setting.values.repos
  }

  get activeOrgs() {
    return this.setting.orgs
  }
}
