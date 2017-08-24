// @flow
import { Setting } from '@mcro/models'
import type { Job, User } from '@mcro/models'
import type { SyncOptions } from '~/types'

type GithubSetting = {
  values: {
    orgs: {
      [string]: boolean,
    },
  },
}

export default class GithubSync {
  user: User
  setting: ?GithubSetting = null
  baseUrl = 'https://api.github.com'

  constructor({ user }: SyncOptions) {
    this.user = user
  }

  get token(): ?string {
    return this.user.github && this.user.github.auth.accessToken
  }

  fetch = (path: string, opts?: Object) =>
    fetch(
      `${this.baseUrl}${path}?access_token=${this.token || ''}`,
      opts
    ).then(res => res.json())

  start = async () => {
    this.setting = await Setting.findOne({
      userId: this.user.id,
      type: 'github',
    }).exec()
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
    if (!this.token) {
      console.error('No User.github found, changed since sync started?')
      return
    }
    if (!this.setting) {
      console.error('No setting for user and github! :(')
      return
    }

    for (const org of Object.keys(this.setting.values.orgs)) {
      console.log('syncing org', org)
    }
  }
}
