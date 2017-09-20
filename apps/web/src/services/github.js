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
      () => CurrentUser.user && CurrentUser.user.authorizations,
      ({ github }) => {
        console.log('waht', github)
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
}
