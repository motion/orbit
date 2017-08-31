import { User, Setting } from '@mcro/models'
import { store } from '@mcro/black/store'

@store
export default class Models {
  users = User.find()

  start() {
    this.react(() => this.users, this.processUsers)
  }

  processUsers = () => {
    for (const user of this.users) {
      if (user.github) {
        this.ensureGithubSetting(user)
      }
    }
  }

  ensureGithubSetting = async user => {
    console.log('ensure setting for user', user.id)
    this.setTimeout(async () => {
      console.log('now do it ok')
      await Setting.findOrCreate({
        type: 'github',
        userId: user.id,
      })
    }, 4000)
  }

  dispose() {
    this.subscriptions.dispose()
  }
}
