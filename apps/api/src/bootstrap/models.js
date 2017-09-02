import { User, Setting } from '@mcro/models'
import { store } from '@mcro/black/store'

@store
export default class Models {
  users = User.find()

  start() {
    this.react(() => this.users, this.processUsers)
  }

  processUsers = () => {
    if (!this.users) {
      return
    }
    for (const user of this.users) {
      if (user.github) {
        this.ensureGithubSetting(user)
      }
    }
  }

  ensureGithubSetting = async user => {
    console.log('ensure setting for user', user.id)
    // temp bugfix, running get first syncs it more deterministically
    await Setting.get({ type: 'github' })
    await Setting.findOrCreate({
      type: 'github',
      userId: user.id,
    })
  }

  dispose() {
    this.subscriptions.dispose()
  }
}
