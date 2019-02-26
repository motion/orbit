import { ensure, react, sleep } from '@mcro/black'
import { Bit, Setting } from '@mcro/models'
import { App, AppState } from '@mcro/stores'
import * as React from 'react'
import { AppActions } from '../../actions/appActions/AppActions'
import { PEEK_ID } from '../../constants'

type AppPageItemState = AppState & {
  model: Bit | Setting
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

  history = []
  contentFrame = React.createRef<HTMLDivElement>()

  isPeek = react(() => !this.appState.torn, _ => _)

  // appConfig given the id
  appState = react(
    () => App.getAppState(PEEK_ID),
    async (appState, { sleep, state }) => {
      if (!appState) {
        console.log('weird no app state...', appState)
        return {} as AppState
      }
      if (!appState.torn && state.hasResolvedOnce) {
        await sleep(20)
      }
      if (this.isTorn) {
        // cancel on no app state so we dont cause bugs on close
        ensure('state', !!appState)
      }
      return appState
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

  tearPeek = async () => {
    if (this.isTorn) {
      return false
    }
    AppActions.tearPeek()
    await sleep(16)
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
