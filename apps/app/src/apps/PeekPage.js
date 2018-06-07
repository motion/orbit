import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import * as PeekContents from './peek/peekContents'
import { capitalize } from 'lodash'
import { PeekFrame } from './peek/peekFrame'

class PeekStore {
  headerHeight = 20
  history = []

  get hasHistory() {
    return this.history.length
  }

  get curState() {
    if (this.props.fixed) {
      return App.peekState
    }
    if (!App.peekState.target) {
      return null
    }
    if (App.orbitState.docked || !App.orbitState.hidden) {
      return App.peekState
    }
    return null
  }

  updateHistory = react(
    () => this.curState,
    state => {
      console.log('adding history', this.history, state)
      if (state) {
        this.history.push(state)
      } else {
        this.history = []
      }
    },
    { delay: 32 },
  )

  setHeaderHeight = height => {
    this.headerHeight = height
  }

  get state() {
    let state = this.curState
    if (this.willHide) {
      state = this.lastState
    }
    return state
  }

  lastState = react(() => this.curState, _ => _, {
    delay: 16,
    immediate: true,
    log: false,
  })

  get willHide() {
    return !!this.lastState && !this.curState
  }

  get willShow() {
    return !!this.curState && !this.lastState
  }

  get willStayShown() {
    return !!this.lastState && !!this.curState
  }
}

@view.attach('appStore')
@view.provide({
  peekStore: PeekStore,
})
@view
export class PeekPage extends React.Component {
  render({ peekStore, appStore }) {
    if (!peekStore.state) {
      return null
    }
    const { bit } = peekStore.state
    const type = (bit && capitalize(bit.type)) || 'Empty'
    const PeekContentsView = PeekContents[type] || PeekContents['Empty']
    if (!PeekContentsView) {
      console.error('none', type)
      return <peek>no pane found</peek>
    }
    return (
      <UI.Theme name="light">
        <PeekFrame>
          <PeekContentsView
            if={appStore.selectedBit}
            bit={appStore.selectedBit}
            person={appStore.selectedBit}
            appStore={appStore}
            peekStore={peekStore}
          />
        </PeekFrame>
      </UI.Theme>
    )
  }
}
