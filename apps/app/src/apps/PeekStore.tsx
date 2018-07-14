import { react, on } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { Person, Bit } from '@mcro/models'
import { deepClone } from '../helpers'
import * as Constants from '../constants'

const TYPE_THEMES = {
  person: 'orange',
  setting: 'gray',
}

const INTEGRATION_THEMES = {
  slack: { background: '#FDDE64' },
  github: { background: '#333', color: 'white' },
  gdocs: { background: '#7DA5F4' },
  jira: { background: 'darkblue', color: 'white' },
  confluence: { background: 'darkblue', color: 'white' },
  gmail: { background: 'darkred', color: 'white' },
}

const PERSON_THEME = {
  background: 'rgba(0,0,0,0.013)',
  color: '#444',
}

const BASE_THEME = {
  background: '#fff',
  color: '#444',
}

export class PeekStore {
  tornState = null
  dragOffset: [number, number] = null
  history = []

  get theme() {
    if (!this.model) {
      return null
    }
    const item = App.peekState.item
    if (TYPE_THEMES[item]) {
      return TYPE_THEMES[item]
    }
    if (this.model instanceof Person) {
      return PERSON_THEME
    }
    const intTheme =
      this.model instanceof Bit
        ? INTEGRATION_THEMES[this.model.integration || this.model.type]
        : null
    return intTheme || BASE_THEME
  }

  get hasHistory() {
    return this.history.length > 1
  }

  unTear = react(
    () => App.peekState.pinned,
    pinned => {
      if (pinned) {
        throw react.cancel
      }
      this.clearTorn()
    },
  )

  clearTorn = () => {
    this.dragOffset = null
    this.tornState = null
  }

  get peekItem() {
    return this.tornState ? this.tornState.item : App.peekState.item
  }

  model = react(
    () => this.peekItem,
    async item => {
      if (this.model && this.tornState) {
        throw react.cancel
      }
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
    { delay: 200, immediate: true },
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

  get framePosition() {
    const { willShow, willStayShown, willHide, state } = this
    if (!state) {
      return [0, 0]
    }
    const { docked, orbitOnLeft } = App.orbitState
    const onRight = state && !state.peekOnLeft
    // determine x adjustments
    let peekAdjustX = 0
    // adjust for orbit arrow blank
    if (!docked && orbitOnLeft && !onRight) {
      peekAdjustX -= Constants.SHADOW_PAD
    }
    // small adjust to overlap
    peekAdjustX += onRight ? -2 : 2
    const animationAdjust = (willShow && !willStayShown) || willHide ? -8 : 0
    const position = state.position
    let x = position[0] + peekAdjustX
    let y = position[1] + animationAdjust
    if (this.dragOffset) {
      const [xOff, yOff] = this.dragOffset
      x += xOff
      y += yOff
    }
    return [x, y]
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

  tearPeek = () => {
    this.tornState = { ...this.state }
    this.props.appStore.clearSelected(false)
  }

  onDragStart = e => {
    e.preventDefault()
    this.tearPeek()
    // set initial offset of mouse from frame
    let mouseDown
    const offMove = on(this, window, 'mousemove', e => {
      if (!mouseDown) {
        // Desktop.mouseState.mouseDown is a bit better because its from before you start dragging
        mouseDown = mouseDown ||
          Desktop.mouseState.mouseDown || [e.clientX, e.clientY]
      }
      const { x, y } = mouseDown
      this.dragOffset = [e.clientX - x, e.clientY - y]
    })
    const offUp = on(this, window, 'mouseup', e => {
      offMove()
      offUp()
      // now that it's pinned, update position
      App.actions.finishPeekDrag(this.framePosition)
    })
  }
}
