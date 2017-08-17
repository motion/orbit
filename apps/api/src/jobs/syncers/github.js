// @flow
import type { Job } from '@mcro/models'
import { User } from '@mcro/models'

export default class GithubSync {
  async activate() {
    console.log('activate github syncer')
  }

  async dispose() {
    console.log('dispose github syncer')
  }

  async run(job: Job) {
    const { userId } = job.info
    console.log('got a job for userId', userId)

    const user = await User.get(userId)
    console.log('got user', user)
  }
}
