import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { Person, Bit } from '@mcro/models'
import { deepClone } from '../../../helpers'
import * as Constants from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import { SearchStore } from '../../../stores/SearchStore'

const TYPE_THEMES = {
  person: {
    background: 'rgba(0,0,0,0.013)',
    color: '#444',
  },
  // setting: 'gray',
}

const INTEGRATION_THEMES = {
  slack: { background: '#FDDE64' },
  github: { background: '#353535', color: 'white' },
  gdocs: { background: '#7DA5F4' },
  jira: { background: '#4978D0', color: 'white' },
  confluence: { background: '#4B7BD4', color: 'white' },
  gmail: { background: '#D2675E', color: 'white' },
}

const BASE_THEME = {
  background: '#fff',
  color: '#444',
}

export class PeekStore {
  props: {
    appStore: AppStore
    searchStore: SearchStore
    fixed?: boolean
  }

  tornState = null
  dragOffset: [number, number] = null
  history = []

  curState = react(
    () => [
      this.tornState,
      App.peekState,
      App.orbitState,
      this.props.searchStore.selectedItem,
    ],
    async (
      [tornState, { target }, { docked, hidden }, selectedItem],
      { sleep },
    ) => {
      // debounce just a tiny bit to avoid renders as selectedItem updated a bit after peekState
      await sleep(16 * 2)
      if (tornState) {
        return tornState
      }
      if (!target) {
        return null
      }
      if (docked || !hidden) {
        return {
          _internalId: Math.random(),
          ...App.peekState,
          model: selectedItem,
        }
      }
      return null
    },
    {
      immediate: true,
    },
  )

  // reaction because we don't want to re-render on this.lastState changes
  state = react(
    () => [this.curState, this.lastState],
    ([curState, lastState]) => {
      if (this.willHide) {
        return this.lastState
      }
      // avoid re-renders on update lastState when showing
      if (
        curState &&
        lastState &&
        curState._internalId === lastState._internalId
      ) {
        throw react.cancel
      }
      return curState
    },
    {
      immediate: true,
    },
  )

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

  get theme() {
    if (!this.state || !this.state.item) {
      return BASE_THEME
    }
    const { type, integration } = this.state.item
    return INTEGRATION_THEMES[integration] || TYPE_THEMES[type] || BASE_THEME
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

  tearPeek = () => {
    this.tornState = { ...this.state }
    App.sendMessage(App, App.messages.CLEAR_SELECTED)
  }

  offMove = null
  offUp = null
  initMouseDown = null

  onDragStart = e => {
    e.preventDefault()
    this.tearPeek()
    this.clearDragHandlers()
    this.initMouseDown = {
      x: e.clientX,
      y: e.clientY,
    }
    this.offMove = on(this, window, 'mousemove', this.handleDragMove)
    this.offUp = on(this, window, 'mouseup', this.handleDragEnd)
  }

  clearDragHandlers = () => {
    if (this.offMove) {
      this.offMove()
      this.offMove = null
    }
    if (this.offUp) {
      this.offUp()
      this.offUp = null
    }
  }

  handleDragMove = e => {
    const { x, y } = this.initMouseDown
    this.dragOffset = [e.clientX - x, e.clientY - y]
    console.log('this.dragOffset', this.dragOffset, e.clientX, e.clientY)
  }

  handleDragEnd = () => {
    this.clearDragHandlers()
    // now that it's pinned, update position
    App.actions.finishPeekDrag(this.framePosition)
  }
}
