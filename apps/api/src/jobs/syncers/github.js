// @flow
import { Setting } from '@mcro/models'
import type { Job } from '@mcro/models'

export default class GithubSync {
  user = null
  setting = null

  constructor({ user }) {
    this.user = user
  }

  get githubToken() {
    return this.user && this.user.github && this.user.github.auth.accessToken
  }

  baseUrl = 'https://api.github.com'

  start = async () => {
    this.setting = await Setting.findOne({
      userId: this.user.id,
      type: 'github',
    }).exec()

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
