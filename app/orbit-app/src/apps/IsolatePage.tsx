import * as React from 'react'
import { view } from '@mcro/black'
import { BitRepository, SettingRepository } from '@mcro/model-bridge'
import { Peek } from './peek/Peek'
import { OrbitStore } from './OrbitStore'
import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import { settingToAppConfig } from '../helpers/toAppConfig/settingToAppConfig'
import { Actions } from '../actions/Actions'
import { OrbitDocked } from './orbit/orbitDocked/OrbitDocked'

const getItem = {
  githubItem: () => BitRepository.findOne({ where: { integration: 'github' }, skip: 6 }),
  gdriveSetting: async () => ({
    id: 1,
    title: 'GDocs',
    type: 'setting',
    integration: 'gdrive',
  }),
  githubSetting: async () =>
    SettingRepository.findOne({ where: { type: 'github' } }).then(settingToAppConfig),
}

@view
export class IsolatePeek extends React.Component {
  render() {
    getItem.githubSetting().then(item => {
      console.log('got', item)
      Actions.setPeekApp(item, {
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
    return <OrbitDocked />
  }
}

@view.provide({
  orbitStore: OrbitStore,
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
