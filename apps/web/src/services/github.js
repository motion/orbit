import Octokat from 'octokat'
import { store, watch } from '@mcro/black'

@store
export default class GithubService {
  user = null

  @watch
  orgs = () => this.setting && this.github && this.github.user.orgs.fetchAll()

  @watch
  allRepos = () =>
    this.github &&
    this.activeOrgs &&
    Promise.all(
      this.activeOrgs.map(org =>
        this.github.orgs(org).repos.fetchAll().then(repos => ({ org, repos }))
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

  constructor(user: CurrentUser) {
    this.user = user
  }

  get token() {
    return this.user && this.user.github && this.user.github.auth.accessToken
  }

  get setting() {
    return this.user && this.user.setting.github
  }

  get activeOrgs() {
    return (
      this.setting && Object.keys(this.setting.values.orgs).filter(x => !!x)
    )
  }
}
