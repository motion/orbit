// @flow
import Octokat from 'octokat'
import { store, watch } from '@mcro/black'
import type CurrentUser from '../stores/currentUserStore'

type GithubRepo = {
  id: number,
  owner: Object,
  name: string,
  url: string,
  default_branch: string,
  permissions: Object,
  created_at: string,
  updated_at: string,
}

@store
export default class GithubService {
  user: ?CurrentUser = null

  @watch
  orgs = () => this.setting && this.github && this.github.user.orgs.fetchAll()

  @watch
  repos: Array<GithubRepo> = () =>
    this.github &&
    this.activeOrgs &&
    this.activeOrgs.map(org => this.github.orgs(org).repos.fetchAll())

  @watch
  github: Octokat = () =>
    this.token &&
    new Octokat({
      token: this.token,
    })

  constructor(user: CurrentUser) {
    this.user = user
  }

  get token() {
    return this.user && this.user.github && this.user.github.auth.accessToken
  }

  get setting() {
    return this.user && this.user.setting.github
  }

  get activeOrgs(): { [string]: boolean } {
    return (
      this.setting && Object.keys(this.setting.values.orgs).filter(x => !!x)
    )
  }
}
