import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/stores'
import * as PeekContents from './peek/peekContents'
import { capitalize } from 'lodash'
import { PeekFrame } from './peek/PeekFrame'
import { Person, Bit } from '@mcro/models'

const deepClone = obj =>
  obj
    ? Object.keys(obj).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: JSON.parse(JSON.stringify(obj[cur])),
        }),
        {},
      )
    : obj

class PeekStore {
  headerHeight = 20
  history = []

  get hasHistory() {
    return this.history.length > 1
  }

  model = react(
    () => App.peekState.item,
    async item => {
      if (!item) {
        return null
      }
      if (item.type === 'person') {
        return await Person.findOne({ id: item.id })
      }
      if (item.type === 'setting') {
        return item
      }
      if (item.type === 'team') {
        return item
      }
      const res = await Bit.findOne({
        where: {
          id: item.id,
        },
        relations: ['people'],
      })
      if (!res) {
        return item
      }
      return res
    },
    { delay: 32, immediate: true },
  )

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

  lastState = react(() => this.curState, deepClone, {
    delay: 16,
    immediate: true,
  })

  get willHide() {
    return !!this.lastState && !this.curState
  }

  get willShow() {
    return !!this.curState && !this.lastState
  }

  willStayShown = react(() => this.willShow, _ => _, {
    delay: 16,
  })
}

@view
class PeekPageInner extends React.Component {
  render({ peekStore, appStore }) {
    if (!peekStore.state) {
      return null
    }
    const { item, peekId } = peekStore.state
    const type = (item && capitalize(item.type)) || 'Empty'
    const PeekContentsView = PeekContents[type]
    if (!PeekContentsView) {
      console.error('none', type)
      return <peek>no pane found</peek>
    }
    if (!peekStore.model) {
      console.warn('no selected model')
      return <peek>no selected model</peek>
    }
    return (
      <PeekContentsView
        key={peekId}
        bit={peekStore.model}
        person={peekStore.model}
        appStore={appStore}
        peekStore={peekStore}
      />
    )
  }
}

@view.attach('appStore')
@view.provide({
  peekStore: PeekStore,
})
export class PeekPage extends React.Component {
  render() {
    const { appStore, peekStore } = this.props
    return (
      <UI.Theme name="light">
        <PeekFrame>
          <PeekPageInner appStore={appStore} peekStore={peekStore} />
        </PeekFrame>
      </UI.Theme>
    )
  }
}
