import * as React from 'react'
import { view } from '@mcro/black'
import { PeekPage } from './PeekPage'
import { OrbitPage } from './OrbitPage'
import { AppStore } from '~/stores/appStore'
import * as PeekStateActions from '~/actions/PeekStateActions'
import { App } from '@mcro/all'
import { Bit } from '@mcro/models'

const set = async () => {
  console.log('setting up')
  const bit = await Bit.findOne({ where: { integration: 'github' }, skip: 6 })
  PeekStateActions.selectItem(
    bit,
    // {
    //   type: 'setting',
    //   integration: 'github',
    // },
    {
      top: window.innerHeight,
      left: 100,
      width: 100,
      height: 10,
    },
  )
}

setTimeout(() => {
  set()
}, 500)

@view
export class IsolatePeek extends React.Component {
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
    return <IsolatePeek />
  }
}
