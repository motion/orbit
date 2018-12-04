import { view, provide } from '@mcro/black'
import { loadOne } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../actions/AppActions'
import { OrbitWindowStore } from '../stores/OrbitWindowStore'
import { AppPage } from './AppPage/AppPage'
import { OrbitPaneManager } from './OrbitPage/OrbitPaneManager'

const getItem = {
  githubItem: () =>
    loadOne(BitModel, {
      args: { where: { integration: 'github' }, skip: 6 },
    }),
  driveSetting: async () => ({
    id: 1,
    title: 'GDocs',
    type: 'setting',
    integration: 'drive',
  }),
}

@view
export class IsolatePeek extends React.Component {
  render() {
    getItem.githubSetting().then(item => {
      console.log('got', item)
      AppActions.setPeekApp({
        appConfig: item,
        target: {
          top: window.innerHeight,
          left: window.innerHeight - 350,
          width: 0,
          height: 10,
        },
      })
    })
    return <AppPage />
  }
}

export class IsolateHome extends React.Component {
  componentDidUpdate() {
    AppActions.setOrbitDocked(true)
  }

  render() {
    return <OrbitPaneManager />
  }
}

@provide({
  orbitWindowStore: OrbitWindowStore,
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
