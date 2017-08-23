// @flow
import { store, watch } from '@mcro/black/store'
import { Setting } from '@mcro/models'
import type { Job } from '@mcro/models'

@store
export default class GithubSync {
  user = null
  @watch
  setting = () => {
    console.log('RUNNING WATCH OF SETTING, USER?', !!this.user)

    return (
      this.user &&
      Setting.findOne({
        userId: this.user.id,
        type: 'github',
      })
    )
  }

  constructor({ user }) {
    this.user = user
  }

  get githubToken() {
    return this.user && this.user.github && this.user.github.auth.accessToken
  }

  baseUrl = 'https://api.github.com'

  start = () => {
    console.log('activate github syncer', this.setting)
  }

  async dispose() {
    console.log('dispose github syncer')
  }

  fetchers = {
    organizations: {
      url: '/organizations',
    },
    repoEvents: {
      url: '/repos/:user/',
    },
  }

  run = async (job: Job) => {
    if (!this.githubToken) {
      console.error('No User.github found, changed since sync started?')
      return
    }
    if (!this.setting) {
      console.error('No setting for user and github! :(')
      return
    }
  }
}
