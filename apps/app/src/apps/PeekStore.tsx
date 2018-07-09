import { react } from '@mcro/black'
import { App } from '@mcro/stores'
import { Person, Bit } from '@mcro/models'
import { deepClone } from '../helpers'

const TYPE_THEMES = {
  person: 'orange',
  setting: 'gray',
}

const INTEGRATION_THEMES = {
  slack: { background: '#FDDE64' },
  github: { background: '#333', color: 'white' },
  gdocs: '#7DA5F4',
  jira: 'darkblue',
  confluence: 'darkblue',
  gmail: 'red',
}

export class PeekStore {
  tornState = null
  moving = false
  history = []

  get theme() {
    if (!this.model) {
      return null
    }
    const item = App.peekState.item
    if (TYPE_THEMES[item]) {
      return TYPE_THEMES[item]
    }
    const intTheme = INTEGRATION_THEMES[this.model.integration]
    return intTheme || null
  }

  get hasHistory() {
    return this.history.length > 1
  }

  unTear = react(
    () => this.willHide,
    async (_, { sleep }) => {
      await sleep(100)
      this.tornState = null
    },
  )

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
    if (this.tornState) {
      return this.tornState
    }
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

  onDragStart = e => {
    e.preventDefault()
    this.tornState = {
      ...this.state,
    }
    this.moving = true
  }

  onDrag = e => {
    e.preventDefault()
    e.persist()
    console.log('e', e.clientX, e.clientY)
    // this.tornPosition = [100, 100]
  }

  onDragEnd = e => {
    e.preventDefault()
    this.moving = false
  }
}
