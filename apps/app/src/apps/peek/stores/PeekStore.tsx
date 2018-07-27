import * as React from 'react'
import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import * as Constants from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import { SearchStore } from '../../../stores/SearchStore'

const TYPE_THEMES = {
  person: {
    titlebarBackground: 'rgba(0,0,0,0.1)',
    headerBackground: 'transparent',
    background: '#f2f2f2',
    color: '#444',
  },
  // setting: 'gray',
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
  contentFrame = React.createRef<HTMLDivElement>()

  get highlights(): HTMLDivElement[] {
    this.state // update on state...?
    return Array.from(this.contentFrame.current.querySelectorAll('.highlight'))
  }

  scrollToHighlight = react(
    () => this.props.searchStore.highlightIndex,
    async (index, { sleep }) => {
      if (typeof index !== 'number') {
        throw react.cancel
      }
      const frame = this.contentFrame.current
      if (!frame) {
        throw react.cancel
      }
      await sleep(150)
      const activeHighlight = this.highlights[index]
      if (!activeHighlight) {
        console.error('no highlight at index', index, this.highlights)
        throw react.cancel
      }
      // move frame to center the highlight but 100px more towards the top which looks nicer
      frame.scrollTop = activeHighlight.offsetTop - frame.clientHeight / 2 + 100
    },
    {
      immediate: true,
    },
  )

  goToNextHighlight = () => {
    const { highlightIndex, setHighlightIndex } = this.props.searchStore
    // loop back to beginning once at end
    const next = (highlightIndex + 1) % this.highlights.length
    setHighlightIndex(next)
  }

  curState = react(
    () => [
      this.tornState,
      App.peekState.target,
      App.orbitState.docked,
      App.orbitState.hidden,
      this.props.searchStore.selectedItem,
    ],
    async ([tornState, target, docked, hidden, selectedItem], { sleep }) => {
      console.log('peek curState reaction!!!!')
      // debounce just a tiny bit to avoid renders as selectedItem updated a bit after peekState
      await sleep()
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
      log: false,
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
      log: false,
    },
  )

  lastState = react(
    () => this.curState,
    state => {
      if (!state) {
        return state
      }
      const { model, ...restState } = state
      return {
        ...JSON.parse(JSON.stringify(restState)),
        model,
      }
    },
    {
      // delay a bit more here to let peek render
      // our only time constraint is having this ready for when it leaves
      delay: 40,
      immediate: true,
    },
  )

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
    return (
      Constants.INTEGRATION_THEMES[integration] ||
      TYPE_THEMES[type] ||
      BASE_THEME
    )
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
  }

  handleDragEnd = () => {
    this.clearDragHandlers()
    // now that it's pinned, update position
    App.actions.finishPeekDrag(this.framePosition)
  }
}
