import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'
import PeekFrame from './peekFrame'

class PeekStore {
  headerHeight = 0
  history = []

  get hasHistory() {
    return this.history.length
  }

  @react
  updateHistory = [
    () => this.curState,
    state => {
      this.headerHeight = 20
      if (state) {
        this.history.push(state)
      } else {
        this.history = []
      }
    },
  ]

  get state() {
    let state = this.curState
    if (this.willHide) {
      state = this.lastState
    }
    return state
  }

  get curState() {
    if (!App.peekState.target) {
      return null
    }
    if (App.orbitState.docked || !App.orbitState.hidden) {
      return App.peekState
    }
    return null
  }

  @react({ delay: 16, fireImmediately: true, log: false })
  lastState = [() => this.curState, _ => _]

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
export default class PeekPage {
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
  ß
}
