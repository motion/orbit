import * as React from 'react'
import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { PEEK_THEMES } from '../../../constants'
import { AppStore } from '../../../stores/AppStore'
import { SearchStore } from '../../../stores/SearchStore'

export class PeekStore {
  props: {
    appStore: AppStore
    searchStore: SearchStore
    fixed?: boolean
  }

  debug = true
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

  state = react(
    () => [
      this.tornState,
      App.peekState.target,
      App.orbitState.docked,
      App.orbitState.hidden,
    ],
    (_, { getValue }) => {
      const lastState = getValue()
      const curState = this.getCurState()
      return {
        lastState,
        curState,
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

  // these get helpers just proxy to .state

  get lastState() {
    return this.state.lastState
  }

  get curState() {
    return this.state.curState
  }

  get willHide() {
    return this.state.willHide
  }

  get willShow() {
    return this.state.willShow
  }

  get willStayShown() {
    return this.state.willStayShown
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
    if (!this.curState.item) {
      return PEEK_THEMES.base
    }
    const { type, integration } = this.curState.item
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
    const { willShow, willStayShown, willHide, curState } = this
    if (!curState) {
      return [0, 0]
    }
    const { docked, orbitOnLeft } = App.orbitState
    const onRight = curState && !curState.peekOnLeft
    // determine x adjustments
    let peekAdjustX = 0
    // adjust for orbit arrow blank
    if (!docked && orbitOnLeft && !onRight) {
      peekAdjustX -= Constants.SHADOW_PAD
    }
    // small adjust to overlap
    peekAdjustX += onRight ? -2 : 2
    const animationAdjust = (willShow && !willStayShown) || willHide ? -8 : 0
    const position = curState.position
    let x = position[0] + peekAdjustX
    let y = position[1] + animationAdjust
    if (this.dragOffset) {
      const [xOff, yOff] = this.dragOffset
      x += xOff
      y += yOff
    }
    return [x, y]
  }

  tearPeek = () => {
    this.tornState = { ...this.curState }
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
