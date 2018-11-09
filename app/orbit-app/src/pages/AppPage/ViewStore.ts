import { ensure, on, react, sleep } from '@mcro/black'
import { Bit, PersonBit, Setting } from '@mcro/models'
import { App, AppState } from '@mcro/stores'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { APP_ID } from '../../constants'

type ViewStoreItemState = AppState & {
  model: PersonBit | Bit | Setting
}

export type ViewStoreState = {
  willShow: boolean
  willStayShown: boolean
  willHide: boolean
  isShown: boolean
  curState: ViewStoreItemState
  lastState: ViewStoreItemState
  torn: boolean
}

export class ViewStore {
  props: {
    fixed?: boolean
  }

  get id() {
    return APP_ID
  }

  dragOffset?: [number, number] = null
  history = []
  contentFrame = React.createRef<HTMLDivElement>()

  willUnmount() {
    this.clearDragHandlers()
  }

  isPeek = react(() => !this.appState.torn, _ => _, {
    onlyUpdateIfChanged: true,
  })

  // appConfig given the id
  appState = react(
    () => App.appsState.find(x => x.id === this.id),
    async (appState, { sleep, state }) => {
      if (!appState.torn && state.hasResolvedOnce) {
        await sleep(60)
      }
      if (this.isTorn) {
        // cancel on no app state so we dont cause bugs on close
        ensure('state', !!appState)
      }
      return appState
    },
    {
      defaultValue: {},
      onlyUpdateIfChanged: true,
    },
  )

  internalState = react(
    () => this.appState,
    async (appState, { getValue }) => {
      const lastState = getValue().curState
      const wasShown = !!(lastState && lastState.target)
      const isShown = !!appState.appConfig
      return {
        torn: appState.torn,
        lastState,
        curState: appState,
        isShown,
        willHide: !!lastState && !isShown,
        willShow: !!isShown && !wasShown,
        willStayShown: !!isShown && !!wasShown,
      } as ViewStoreState
    },
    {
      onlyUpdateIfChanged: true,
      defaultValue: {
        torn: false,
        lastState: null,
        curState: null,
        willHide: false,
        willShow: false,
        willStayShown: false,
      },
    },
  )

  state: ViewStoreItemState = react(
    () => {
      const { lastState, curState, willHide } = this.internalState
      if (willHide) {
        return lastState
      }
      return curState
    },
    _ => _,
    {
      onlyUpdateIfChanged: true,
    },
  )

  isShown = react(() => this.internalState.isShown, _ => _)
  willHide = react(() => this.internalState.willHide, _ => _)
  isTorn = react(() => this.internalState.torn, _ => _)
  willStayShown = react(() => this.internalState.willStayShown, _ => _)

  // only keep it alive for a frame
  willShow = react(
    () => this.internalState.willShow,
    async (willShow, { setValue, sleep }) => {
      if (willShow) {
        setValue(true)
        await sleep(100)
      }
      return false
    },
  )

  get hasHistory() {
    return this.history.length > 1
  }

  clearTorn = () => {
    this.dragOffset = null
  }

  get framePosition() {
    const { willShow, willStayShown, willHide, state } = this
    if (!state || !state.position) {
      return [0, 0]
    }
    // determine x adjustments
    const animationAdjust = (willShow && !willStayShown) || willHide ? -6 : 0
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

  tearPeek = async () => {
    if (this.isTorn) {
      return false
    }
    AppActions.tearPeek()
    await sleep(16)
    App.sendMessage(App, App.messages.CLEAR_SELECTED)
  }

  offMove = null
  offUp = null
  initMouseDown = null

  onDragStart = e => {
    console.log('drag titlebar...')
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

  // this is triggered after Actions.finishPeekDrag
  // where we can reset the dragOffset in the same frame
  finishDrag = false
  resetDragOffsetOnFinishDrag = react(
    () => App.getAppState(this.id).position,
    () => {
      ensure('finished drag', this.finishDrag)
      console.log('finish drag?', this.dragOffset, App.appsState[this.id].position)
      this.dragOffset = [0, 0]
      this.finishDrag = false
    },
  )

  handleDragEnd = () => {
    this.clearDragHandlers()

    // now that it's pinned, update position
    // reset drag offset while simultaneously setting official position
    // this *shouldnt* jitter, technically
    this.finishDrag = true
    AppActions.finishPeekDrag([...this.framePosition])
  }

  handleClose = () => {
    if (this.isTorn) {
      AppActions.closeApp()
    } else {
      AppActions.clearPeek()
    }
  }

  handleMaximize = () => {
    // todo
  }

  handleMinimize = () => {
    // todo
  }

  openItem = () => {
    if (this.state.model.target === 'setting') {
      return
    }
    AppActions.openItem(this.state.model)
  }

  copyItem = () => {
    if (this.state.model.target === 'setting') {
      return
    }
    AppActions.copyLink(this.state.model)
  }
}
