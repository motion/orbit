// @flow
import Octokat from 'octokat'
import { store, watch } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class GithubService {
  get user(): CurrentUser {
    return CurrentUser
  }

  get setting(): ?string {
    return this.user.setting.github
  }

  @watch
  orgs = () => this.setting && this.github && this.github.user.orgs.fetchAll()

  @watch
  allRepos = () =>
    this.github &&
    this.setting &&
    Promise.all(
      this.setting.activeOrgs.map(org =>
        this.github
          .orgs(org)
          .repos.fetchAll()
          .then(repos => ({ org, repos }))
      )
    )

  @watch
  repos = () =>
    this.allRepos &&
    this.allRepos.reduce(
      (acc, { org, repos }) => ({
        ...acc,
        [org]: repos.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {}),
      }),
      {}
    )

  @watch
  github = () =>
    this.token &&
    new Octokat({
      token: this.token,
    })

  get token(): ?string {
    return (this.user.github && this.user.github.auth.accessToken) || null
  }
}
