import * as React from 'react'
import { view } from '@mcro/black'
import { PeekPage } from './PeekPage'
import { OrbitPage } from './OrbitPage'
import { AppStore } from '../stores/AppStore'
import { App } from '@mcro/stores'
import { Bit, Setting } from '@mcro/models'
import * as UI from '@mcro/ui'
import { IntegrationSettingsStore } from '../stores/IntegrationSettingsStore'

const store = new IntegrationSettingsStore()

const getItem = {
  githubItem: () => Bit.findOne({ where: { integration: 'github' }, skip: 6 }),
  gdocsSetting: async () => ({
    id: 1,
    title: 'GDocs',
    type: 'setting',
    integration: 'gdocs',
  }),
  githubSetting: async () =>
    Setting.findOne({ where: { type: 'github' } }).then(store.settingToResult),
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
    return <PeekPage fixed />
  }
}

export class IsolateHome extends React.Component {
  componentDidUpdate() {
    App.setOrbitState({ docked: true })
  }

  render() {
    return <OrbitPage />
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
