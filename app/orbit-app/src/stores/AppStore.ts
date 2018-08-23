import { on, react, isEqual, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { SettingRepository } from '../repositories'
import * as AppStoreHelpers from './helpers/appStoreHelpers'
import { ORBIT_WIDTH } from '@mcro/constants'
import { AppReactions } from './AppReactions'
import { modelQueryReaction } from '../repositories/modelQueryReaction'
import { Bit, Setting } from '@mcro/models'

export class AppStore {
  contentHeight = 0
  lastSelectedPane = ''
  onPinKeyCB = null

  get contentBottom() {
    // always leave x room at bottom
    // leaving a little room at the bottom makes it feel much lighter
    return window.innerHeight - this.contentHeight
  }

  appReactionsStore = new AppReactions({
    onPinKey: key => this.onPinKeyCB(key),
  })

  async willMount() {
    this.updateScreenSize()
  }

  willUnmount() {
    this.appReactionsStore.dispose()
  }

  onPinKey = cb => {
    this.onPinKeyCB = cb
  }

  updateAppOrbitStateOnResize = react(
    () => [this.contentHeight, App.orbitState.docked],
    ([height]) => {
      App.setOrbitState({
        size: [ORBIT_WIDTH, height + 20],
        position: [window.innerWidth - ORBIT_WIDTH, 0],
      })
    },
  )

  get selectedPane() {
    if (App.orbitState.hidden) {
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
    this.contentHeight = height
  }

  appSettings = modelQueryReaction(
    () =>
      SettingRepository.find({
        where: { category: 'integration', token: { $not: 'good' } },
      }),
    {
      ignoreKeys: ['updatedAt', 'values'],
    },
  )

  services = react(
    () => this.appSettings,
    settings => {
      ensure('has settings', !!settings)
      console.log('update services')
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

  getSettingForBit = (bit: Bit): Setting | null => {
    if (!this.appSettings) {
      return null
    }
    return this.appSettings.find(x => x.type === bit.integration)
  }

  updateLastSelectedPane = react(
    () => this.selectedPane,
    val => {
      this.lastSelectedPane = val
    },
    {
      log: false,
    },
  )

  updateScreenSize() {
    on(
      this,
      setInterval(() => {
        if (!App.setState) return
        const screenSize = [window.innerWidth, window.innerHeight]
        if (!isEqual(App.state.screenSize, screenSize)) {
          App.setState({ screenSize })
        }
      }, 1000),
    )
  }
}
