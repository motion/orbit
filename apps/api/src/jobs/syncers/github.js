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
      console.log('sync for user', user.name)
      if (!user.github) {
        throw new Error('User deleted their github link!')
      }
      const token = user.github.auth.accessToken
      console.log('user token for github', token)
    }
  }
}
