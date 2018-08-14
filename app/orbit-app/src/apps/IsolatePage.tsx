import * as React from 'react'
import { view } from '@mcro/black'
import { BitRepository, SettingRepository } from '../repositories'
import { Peek } from './peek/Peek'
import { Orbit } from './orbit/Orbit'
import { AppStore } from '../stores/AppStore'
import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import { IntegrationSettingsStore } from '../stores/IntegrationSettingsStore'
import { settingToResult } from '../helpers/settingToResult'

const store = new IntegrationSettingsStore()

const getItem = {
  githubItem: () =>
    BitRepository.findOne({ where: { integration: 'github' }, skip: 6 }),
  gdocsSetting: async () => ({
    id: 1,
    title: 'GDocs',
    type: 'setting',
    integration: 'gdocs',
  }),
  githubSetting: async () =>
    SettingRepository.findOne({ where: { type: 'github' } }).then(
      settingToResult,
    ),
}

@view
export class IsolatePeek extends React.Component {
  render() {
    getItem.githubSetting().then(item => {
      console.log('got', item)
      App.actions.selectItem(item, {
        top: window.innerHeight,
        left: window.innerHeight - 350,
        width: 0,
        height: 10,
      })
    })
    return <Peek fixed />
  }
}

export class IsolateHome extends React.Component {
  componentDidUpdate() {
    App.setOrbitState({ docked: true })
  }

  render() {
    return <Orbit />
  }
}

@view.provide({
  appStore: AppStore,
})
export class IsolatePage extends React.Component {
  render() {
    return (
      <UI.FullScreen>
        <IsolatePeek />
      </UI.FullScreen>
    )
  }
}
