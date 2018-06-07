import * as React from 'react'
import { view } from '@mcro/black'
import { PeekPage } from './PeekPage'
import { AppStore } from '~/stores/appStore'
import * as PeekStateActions from '~/actions/PeekStateActions'

// todo: set this up so we can easily load in:
//   setting card
//   profile
//   bit
//   project

@view.provide({
  appStore: AppStore,
})
export class IsolatePage extends React.Component {
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
