import * as React from 'react'
import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { PEEK_THEMES } from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import { SearchStore } from '../../../stores/SearchStore'
import * as Constants from '../../../constants'

export class PeekStore {
  props: {
    appStore: AppStore
    searchStore: SearchStore
    fixed?: boolean
  }

  debug = true
  tornState = null
  dragOffset?: [number, number] = null
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

  internalState = react(
    () => [App.peekState.target, App.orbitState.docked, App.orbitState.hidden],
    (_, { getValue }) => {
      const lastState = getValue().curState
      const curState = this.getCurState()
      return {
        lastState,
        curState,
        isShown: !!curState,
        willHide: !!lastState && !curState,
        willShow: !!curState && !lastState,
        willStayShown: !!curState && !!lastState,
      }
    },
    {
      immediate: true,
      defaultValue: {
        lastState: null,
        curState: null,
        willHide: false,
        willShow: false,
        willStayShown: false,
      },
    },
  )

  get state() {
    if (this.tornState) {
      return this.tornState
    }
    if (this.willHide) {
      return this.internalState.lastState
    }
    return this.internalState.curState
  }

  get isShown() {
    return !!this.state.target
  }

  get willHide() {
    return this.internalState.willHide
  }

  // only keep it alive for a frame
  willShow = react(
    () => this.internalState.willShow,
    async (willShow, { setValue, sleep }) => {
      if (willShow) {
        setValue(true)
        await sleep(16)
      }
      setValue(false)
    },
  )

  get willStayShown() {
    return this.internalState.willStayShown
  }

  getCurState = () => {
    if (this.tornState) {
      return this.tornState
    }
    if (!App.peekState.target) {
      return null
    }
    const { selectedItem } = this.props.searchStore
    const { docked, hidden } = App.orbitState
    if (docked || !hidden) {
      return {
        _internalId: Math.random(),
        ...App.peekState,
        model: selectedItem,
      }
    }
    return null
  }

  get theme() {
    if (!this.state.item) {
      return PEEK_THEMES.base
    }
    const { type, integration } = this.state.item
    return (
      PEEK_THEMES.integration[integration] ||
      PEEK_THEMES.type[type] ||
      PEEK_THEMES.base
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
    // determine x adjustments
    const animationAdjust = (willShow && !willStayShown) || willHide ? -8 : 0
    const position = state.position
    let x = position[0]
    let y = position[1] + animationAdjust
    if (this.dragOffset) {
      const [xOff, yOff] = this.dragOffset
      x += xOff
      y += yOff
    }
    return [x, y]
  }

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
