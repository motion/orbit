import { ensure, on, react, sleep } from '@mcro/black'
import { Bit, PersonBit, Setting } from '@mcro/models'
import { App, AppState } from '@mcro/stores'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { APP_ID } from '../../constants'

type AppPageItemState = AppState & {
  model: PersonBit | Bit | Setting
}

export type AppPageState = {
  willShow: boolean
  willStayShown: boolean
  willHide: boolean
  isShown: boolean
  curState: AppPageItemState
  lastState: AppPageItemState
  torn: boolean
}

export class AppPageStore {
  props: {
    fixed?: boolean
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
    () => App.getAppState(APP_ID),
    async (appState, { sleep, state }) => {
      if (!appState) {
        console.log('weird no app state...', appState, APP_ID, JSON.stringify(App.appsState))
        return {} as AppState
      }
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
      defaultValue: App.getAppState(APP_ID),
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
      } as AppPageState
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

  state: AppPageItemState = react(
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
    () => App.getAppState(APP_ID).position,
    () => {
      ensure('finished drag', this.finishDrag)
      console.log('finish drag?', this.dragOffset, App.appsState[APP_ID].position)
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
}
