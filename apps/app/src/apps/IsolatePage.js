import * as React from 'react'
import { view } from '@mcro/black'
import { PeekPage } from './PeekPage'
import { OrbitPage } from './OrbitPage'
import { AppStore } from '~/stores/appStore'
import * as PeekStateActions from '~/actions/PeekStateActions'
import { App } from '@mcro/all'

export class IsolatePeek extends React.Component {
  async componentDidMount() {
    console.log('isolating')
    PeekStateActions.selectItem(
      {
        type: 'setting',
        integration: 'github',
      },
      {
        top: 200,
        left: 100,
        width: 100,
        height: 100,
      },
    )
  }

  render() {
    return <PeekPage fixed />
  }
}

export class IsolateHome extends React.Component {
  componentDidMount() {
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
    return <IsolateHome />
  }
}
