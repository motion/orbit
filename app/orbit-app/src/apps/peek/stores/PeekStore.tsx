import * as React from 'react'
import { react, on, ensure, cancel, sleep } from '@mcro/black'
import { App } from '@mcro/stores'
import { BitRepository, SettingRepository, PersonBitRepository } from '../../../repositories'
import { Bit, Setting, PersonBit } from '@mcro/models'
import { Actions } from '../../../actions/Actions'

type PeekStoreItemState = typeof App.peekState & {
  model: PersonBit | Bit | Setting
}

export type PeekStoreState = {
  willShow: boolean
  willStayShown: boolean
  willHide: boolean
  isShown: boolean
  curState: PeekStoreItemState
  lastState: PeekStoreItemState
  torn: boolean
  resolvedModel: boolean
}

export class PeekStore {
  props: {
    id: number
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
    () => App.appsState.find(x => x.id === this.props.id),
    appState => {
      // if (this.isPeek && state.hasResolvedOnce) {
      //   await sleep(100)
      // }
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
    async (appState, { getValue, setValue }) => {
      const { appConfig, torn, ...rest } = appState
      const lastState = getValue().curState
      const wasShown = !!(lastState && lastState.target)
      const isShown = !!appConfig && (torn || App.orbitState.docked)
      // first make target update quickly so it moves fast
      // while keeping the last model the same so it doesn't flicker
      const curState = {
        torn,
        ...lastState,
        ...rest,
      }
      let nextState: PeekStoreState = {
        resolvedModel: false,
        torn,
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
      // dont update model if already shown and has model
      if (torn && curState.model) {
        throw cancel
      }
      if (isShown) {
        // wait and fetch in parallel
        const model = await this.getModel()
        return {
          resolvedModel: true,
          ...nextState,
          // now update to new model
          curState: {
            ...curState,
            appConfig,
            model,
          },
        }
      }
    },
    {
      onlyUpdateIfChanged: true,
      defaultValue: {
        resolvedModel: false,
        torn: false,
        lastState: null,
        curState: null,
        willHide: false,
        willShow: false,
        willStayShown: false,
      },
    },
  )

  state: PeekStoreItemState = react(
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

  autoSizeAfterRender = react(
    () =>
      this.appState.appConfig &&
      this.appState.appConfig.config &&
      this.appState.appConfig.config.contentSize &&
      this.internalState.resolvedModel &&
      (this.state.model['id'] || this.state.model['email']),
    id => {
      ensure('is ready', !!id)
      console.log('should auto size')
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

  getModel = async () => {
    const { id, type } = this.appState.appConfig
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

  get hasHistory() {
    return this.history.length > 1
  }

  clearTorn = () => {
    this.dragOffset = null
  }

  get framePosition() {
    if (!this.state) {
      return [0, 0]
    }
    const { willShow, willStayShown, willHide, state } = this
    if (!state) {
      return [0, 0]
    }
    // determine x adjustments
    const animationAdjust = (willShow && !willStayShown) || willHide ? -6 : 0
    const position = this.state.position
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
    Actions.tearPeek()
    await sleep(16)
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

  // this is triggered after Actions.finishPeekDrag
  // where we can reset the dragOffset in the same frame
  finishDrag = false
  resetDragOffsetOnFinishDrag = react(
    () => App.getAppState(this.props.id).position,
    () => {
      ensure('finished drag', this.finishDrag)
      console.log('finish drag?', this.dragOffset, App.appsState[this.props.id].position)
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
    Actions.finishPeekDrag([...this.framePosition])
  }

  handleClose = () => {
    if (this.isTorn) {
      Actions.closeApp()
    } else {
      Actions.clearPeek()
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
    Actions.openItem(this.state.model)
  }

  copyItem = () => {
    if (this.state.model.target === 'setting') {
      return
    }
    Actions.copyLink(this.state.model)
  }
}
