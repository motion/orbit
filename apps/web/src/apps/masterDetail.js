// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { Miller, MillerState } from './miller'
import { range, random, last } from 'lodash'

class MillerMailStore {
  animate = true
  millerState = null
  resetKey = 0
  constructor() {
    this.millerState = MillerState.serialize([{ kind: 'mailList', data: {} }])
  }
  reset = () => {
    this.setMillerState(MillerState.serialize([{ kind: 'mailList', data: {} }]))
    this.resetKey++
  }
  millerVersion = 0

  setMillerState = state => {
    this.millerState = state
    this.millerVersion++
  }
}

class MailList {
  constructor({ data }) {
    this.data = data
  }

  results = range(random(3, 10)).map(i => ({ active, highlight }) => {
    let color = 'white'
    if (highlight) color = '#666'
    if (active) color = '#226dbb'

    return (
      <h3
        style={{
          paddingLeft: 3,
          marginLeft: 3,
          borderLeft: `4px solid ${color}`,
        }}
      >
        item {this.data.prefix}
        {i + 1}
      </h3>
    )
  })

  getChildSchema = row => ({
    kind: 'mail',
    data: { text: 'mail item ' + row },
  })
}

class Mail {
  constructor({ data }) {
    this.data = data
  }

  results = [
    () =>
      <h2
        style={{
          alignSelf: 'center',
          textAlign: 'center',
        }}
      >
        mail is {this.data.text}
      </h2>,
  ]
}

@view({
  store: MillerMailStore,
})
class MailMiller {
  render({ store }) {
    const panes = {
      mailList: MailList,
      mail: Mail,
    }

    store.millerVersion

    return (
      <mail>
        <h3>Mail Example</h3>
        <info $$row>
          animate? ({store.animate + ''}){' '}
          <UI.Button onClick={() => (store.animate = !store.animate)}>
            toggle
          </UI.Button>
          <UI.Button onClick={store.reset}>reset state</UI.Button>
        </info>
        <content $$row>
          <Miller
            key={store.resetKey}
            version={store.millerVersion}
            animate={store.animate}
            panes={panes}
            state={store.millerState}
            onChange={store.setMillerState}
          />
          <h4
            if={store.millerState.schema.length < 2}
            style={{
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            select a mail pls!
          </h4>
        </content>
      </mail>
    )
  }
}

class MillerSimpleStore {
  animate = true
  millerState = MillerState.serialize([{ kind: 'list', data: { prefix: '' } }])
  millerVersion = 0

  setMillerState = state => {
    this.millerState = state
    this.millerVersion++
  }
}

class BasicList {
  constructor({ data }) {
    this.data = data
    this.items = 10
  }

  getLength() {
    return this.items
  }

  render = ({ active, onSelect, highlight }) => {
    return range(this.getLength()).map(index => {
      let color = 'white'
      if (index === highlight) color = '#666'
      if (index === active) color = '#226dbb'

      return (
        <h3
          onClick={() => onSelect(index)}
          style={{
            paddingLeft: 3,
            marginLeft: 3,
            borderLeft: `4px solid ${color}`,
          }}
        >
          item {this.data.prefix}
          {index + 1}
        </h3>
      )
    })
  }

  getChildSchema = row => ({
    kind: 'list',
    data: { prefix: this.data.prefix + `${row + 1}.` },
  })
}

@view({
  store: MillerSimpleStore,
})
class SimpleMiller {
  render({ store }) {
    const panes = {
      list: BasicList,
    }

    store.millerVersion

    return (
      <simple>
        <h3>simple lists</h3>
        <info $$row>
          animate? ({store.animate + ''}){' '}
          <UI.Button onClick={() => (store.animate = !store.animate)}>
            toggle
          </UI.Button>
        </info>
        <Miller
          animate={store.animate}
          panes={panes}
          state={store.millerState}
          onChange={store.setMillerState}
        />
      </simple>
    )
  }
}

@view({
  store: class {
    actions: {}
  },
})
export default class MasterPage {
  render({ store }) {
    return (
      <HotKeys handlers={store.actions}>
        <UI.Theme name="light">
          <content>
            <SimpleMiller />
            <br />
            <br />
            <br />
            <br />
            <MailMiller if={false} />
          </content>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {}
}
