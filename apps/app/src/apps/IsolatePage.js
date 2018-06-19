import * as React from 'react'
import { view } from '@mcro/black'
import { PeekPage } from './PeekPage'
import { OrbitPage } from './OrbitPage'
import { AppStore } from '~/stores/appStore'
import * as PeekStateActions from '~/actions/PeekStateActions'
import { App } from '@mcro/stores'
import { Bit } from '@mcro/models'

const getItem = {
  githubItem: () => Bit.findOne({ where: { integration: 'github' }, skip: 6 }),
  gdocsSetting: async () => ({ type: 'setting', integration: 'gdocs' }),
}

@view
export class IsolatePeek extends React.Component {
  render() {
    getItem.gdocsSetting().then(bit => {
      PeekStateActions.selectItem(bit, {
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
      <isolate $$fullscreen>
        <IsolatePeek />
      </isolate>
    )
  }
}
