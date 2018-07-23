import { on, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { Setting, Not, Equal } from '@mcro/models'
import * as AppStoreHelpers from './helpers/appStoreHelpers'
import { modelQueryReaction } from '@mcro/helpers'

export class AppStore {
  contentHeight = 0
  lastSelectedPane = ''

  async willMount() {
    this.updateScreenSize()
  }

  get selectedPane() {
    if (App.orbitState.docked) {
      if (App.state.query) {
        return 'docked-search'
      }
      return 'docked'
    }
    if (!App.orbitState.hidden) {
      if (App.state.query) {
        return 'context-search'
      }
      return 'context'
    }
    return this.lastSelectedPane
  }

  setContentHeight = height => {
    console.log('got pane height', height)
    this.contentHeight = height
  }

  services = modelQueryReaction(
    () =>
      Setting.find({
        where: { category: 'integration', token: Not(Equal('good')) },
      }),
    settings => {
      const services = {}
      for (const setting of settings) {
        const { type } = setting
        if (!setting.token) {
          continue
        }
        if (AppStoreHelpers.allServices[type]) {
          const ServiceConstructor = AppStoreHelpers.allServices[type]()
          services[type] = new ServiceConstructor(setting)
        } else {
          console.warn('no service for', type, AppStoreHelpers.allServices)
        }
      }
      return services
    },
  )

  updateLastSelectedPane = react(
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
  )

  updateScreenSize() {
    on(
      this,
      setInterval(() => {
        if (!App.setState) return
        App.setState({
          screenSize: [window.innerWidth, window.innerHeight],
        })
      }, 1000),
    )
  }
}
