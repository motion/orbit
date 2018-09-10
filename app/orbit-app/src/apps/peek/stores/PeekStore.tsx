import * as React from 'react'
import { react, on, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { PEEK_THEMES } from '../../../constants'
import { AppStore } from '../../AppStore'
import {
  BitRepository,
  SettingRepository,
  PersonBitRepository,
} from '../../../repositories'
import { Bit, Setting, PersonBit } from '@mcro/models'
import { Actions } from '../../../actions/Actions'

type PeekStoreItemState = typeof App.state.peekState & {
  peekId: string
  model: PersonBit | Bit | Setting
}

export type PeekStoreState = {
  willShow: boolean
  willStayShown: boolean
  willHide: boolean
  isShown: boolean
  curState: PeekStoreItemState
  lastState: PeekStoreItemState
}

export class PeekStore {
  props: {
    appStore: AppStore
    fixed?: boolean
  }

  debug = true
  tornState = null
  dragOffset?: [number, number] = null
  history = []
  contentFrame = React.createRef<HTMLDivElement>()

  willUnmount() {
    this.clearDragHandlers()
  }

  get highlights(): HTMLDivElement[] {
    this.state // update on state...?
    return Array.from(this.contentFrame.current.querySelectorAll('.highlight'))
  }

  scrollToHighlight = react(
    () => App.peekState.highlightIndex,
    async (index, { sleep }) => {
      ensure('index number', index === 'number')
      const frame = this.contentFrame.current
      ensure('has frame', !!frame)
      await sleep(150)
      const activeHighlight = this.highlights[index]
      ensure('active highlight', !!activeHighlight)
      // move frame to center the highlight but 100px more towards the top which looks nicer
      frame.scrollTop = activeHighlight.offsetTop - frame.clientHeight / 2 + 100
    },
  )

  goToNextHighlight = () => {
    const { highlightIndex } = App.peekState
    // loop back to beginning once at end
    const next = (highlightIndex + 1) % this.highlights.length
    Actions.setHighlightIndex(next)
  }

  internalState = react(
    () => [App.peekState.appConfig, this.tornState],
    async ([_, tornState], { getValue, setValue, sleep }) => {
      await sleep(16)
      const { appConfig, ...rest } = App.peekState
      const lastState = getValue().curState
      const wasShown = !!(lastState && lastState.target)
      const isShown = !!tornState || (!!appConfig && !!App.orbitState.docked)
      // first make target update quickly so it moves fast
      // while keeping the last model the same so it doesn't flicker
      const curState = {
        ...lastState,
        ...rest,
      }
      let nextState: PeekStoreState = {
        lastState,
        curState,
        isShown,
        willHide: !!lastState && !isShown,
        willShow: !!isShown && !wasShown,
        willStayShown: !!isShown && !!wasShown,
      }
      // avoid showing until loaded if showing for first time
      if (!nextState.willShow) {
        setValue(nextState)
      }
      if (isShown) {
        // wait and fetch in parallel
        const [model] = await Promise.all([
          tornState || this.getModel(),
          sleep(50),
        ])
        return {
          ...nextState,
          // now update to new model
          curState: {
            ...curState,
            appConfig,
            model,
            peekId: `${Math.random()}`,
          },
        }
      }
    },
    {
      defaultValue: {
        lastState: null,
        curState: null,
        willHide: false,
        willShow: false,
        willStayShown: false,
      },
    },
  )

  // make this not change if not needed
  state: PeekStoreItemState = react(
    () => [this.tornState, this.internalState],
    ([tornState, { lastState, curState }]) => {
      if (tornState) {
        return tornState
      }
      if (this.willHide) {
        return lastState
      }
      return curState
    },
    {
      onlyUpdateIfChanged: true,
    },
  )

  get isShown() {
    if (this.tornState) {
      return true
    }
    return this.internalState.isShown
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

  getModel = async () => {
    const { id, type } = App.peekState.appConfig
    let selectedItem = null
    if (type === 'person' || type === 'person-bit') {
      selectedItem = await PersonBitRepository.findOne({
        where: { email: id },
        relations: ['people'],
      })
    } else if (type === 'bit') {
      selectedItem = await BitRepository.findOne({
        where: { id },
        relations: ['people'],
      })
    } else if (type === 'setting') {
      selectedItem = await SettingRepository.findOne(id)
    }
    return selectedItem
  }

  get theme() {
    if (!this.state.appConfig) {
      return PEEK_THEMES.base
    }
    const { type, integration } = this.state.appConfig
    return (
      PEEK_THEMES.integration[integration] ||
      PEEK_THEMES.type[type] ||
      PEEK_THEMES.base
    )
  }

  get hasHistory() {
    return this.history.length > 1
  }

  clearPeek = () => {
    Actions.clearPeek()
    this.clearTorn()
  }

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
    const animationAdjust = (willShow && !willStayShown) || willHide ? -6 : 0
    const position = App.peekState.position
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
    Actions.tearPeek()
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
    // App.setPeekState({
    //   position
    // })
    this.dragOffset = [e.clientX - x, e.clientY - y]
  }

  handleDragEnd = () => {
    this.clearDragHandlers()
    // now that it's pinned, update position
    Actions.finishPeekDrag(this.framePosition)
  }

  openItem = () => {
    if (this.state.model.target === 'setting') {
      return
    }
    Actions.openItem(this.state.model)
  }

  copyItem = () => {
    if (this.state.model.target === 'setting') {
      return
    }
    Actions.copyLink(this.state.model)
  }
}
