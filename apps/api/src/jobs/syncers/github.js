// @flow
import type { Job } from '@mcro/models'
import { User } from '@mcro/models'

export default class GithubSync {
  users = []

  start = () => {
    console.log('activate github syncer')
    return new Promise(resolve => {
      User.find().$.subscribe(allUsers => {
        if (allUsers) {
          console.log('setting users', allUsers.length)
          this.users = allUsers
          resolve()
        }
      })
    })
  }

  async dispose() {
    console.log('dispose github syncer')
  }

  run = async (job: Job) => {
    for (const user of this.users) {
      console.log('sync for user', user.name)
      console.log('github', user.github)
    }
  }
}
