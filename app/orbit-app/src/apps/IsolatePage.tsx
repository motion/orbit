import { view } from '@mcro/black'
import { loadOne } from '@mcro/model-bridge'
import { BitModel, SettingModel } from '@mcro/models'
import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { Actions } from '../actions/Actions'
import { settingToAppConfig } from '../helpers/toAppConfig/settingToAppConfig'
import { OrbitDocked } from './orbit/orbitDocked/OrbitDocked'
import { OrbitStore } from './OrbitStore'
import { Peek } from './peek/Peek'

const getItem = {
  githubItem: () =>
    loadOne(BitModel, {
      args: { where: { integration: 'github' }, skip: 6 },
    }),
  gdriveSetting: async () => ({
    id: 1,
    title: 'GDocs',
    type: 'setting',
    integration: 'gdrive',
  }),
  githubSetting: async () =>
    loadOne(SettingModel, { args: { where: { type: 'github' } } }).then(settingToAppConfig),
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
