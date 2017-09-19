// @flow
import Octokat from 'octokat'
import { store, watch } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class GithubService {
  get setting(): ?string {
    return CurrentUser.setting.github
  }

  get token(): ?string {
    return CurrentUser.user && CurrentUser.token('github')
  }

  @watch
  orgs = () => this.setting && this.github && this.github.user.orgs.fetchAll()

  @watch
  allRepos = () =>
    this.github &&
    this.setting &&
    this.setting.activeOrgs &&
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
  github = () => {
    console.log('running with', CurrentUser.user, this.token)
    return (
      CurrentUser.user &&
      this.token &&
      new Octokat({
        token: this.token,
      })
    )
  }
}
