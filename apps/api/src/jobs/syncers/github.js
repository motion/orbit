// @flow
import type { Job } from '@mcro/models'

export default class GithubSync {
  baseUrl = 'https://api.github.com'

  start = () => {
    console.log('activate github syncer')
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

  run = async (job: Job, users) => {
    for (const user of users) {
      if (!user.github) {
        throw new Error('No User.github found, changed since sync started?')
      }
      const token = user.github.auth.accessToken
      console.log('user token for github', token)
    }
  }
}
