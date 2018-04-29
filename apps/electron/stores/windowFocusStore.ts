import { react, store } from '@mcro/black'
import { App, Electron, Desktop, Swift } from '@mcro/all'
import { globalShortcut } from 'electron'
import debug from '@mcro/debug'

const log = debug('OrbitWindow')

@store
export default class WindowFocusStore {
  show = 0
  orbitRef = null

  setOrbitRef = ref => {
    this.orbitRef = ref
  }

  @react
  unFullScreenOnHide = [
    () => App.isShowingOrbit,
    showing => {
      if (showing) {
        throw react.cancel
      }
      if (Electron.orbitState.fullScreen) {
        log(`clearing`)
        this.clear = Date.now()
      }
    },
  ]

  keyShortcuts = [
    ...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'Delete',
  ].map(key => ({ key, shortcut: `Option+${key}` }))

  @react
  easyPinWithLetter = [
    () => Desktop.isHoldingOption && App.isShowingOrbit,
    async (down, { when }) => {
      await when(() => !App.isAnimatingOrbit)
      if (down) {
        for (const { key, shortcut } of this.keyShortcuts) {
          globalShortcut.register(shortcut, async () => {
            // PIN
            if (!Electron.orbitState.pinned) {
              Electron.setOrbitState({ pinned: true })
            }
            // TYPE THE KEY
            Electron.sendMessage(App, `${App.messages.PIN}-${key}`)
            // FOCUS
            this.focusOrbit()
            // then register shortcuts
            await when(() => !Desktop.isHoldingOption)
            this.unRegisterKeyShortcuts()
          })
        }
      } else {
        await when(() => !Desktop.isHoldingOption)
        this.unRegisterKeyShortcuts()
      }
    },
  ]

  unRegisterKeyShortcuts = () => {
    for (const { shortcut } of this.keyShortcuts) {
      globalShortcut.unregister(shortcut)
    }
  }

  focusOrbit = () => {
    if (!this.orbitRef) return
    if (Electron.orbitState.fullScreen) return
    this.orbitRef.focus()
  }

  @react
  watchFullScreenForFocus = [
    () => Electron.orbitState.fullScreen,
    fullScreen => {
      if (fullScreen) {
        this.focusOrbit()
      } else {
        Swift.defocus()
      }
    },
  ]

  @react
  focusOnPinned = [
    () => App.dockState.pinned || Electron.orbitState.pinned,
    async (pinned, { sleep, when }) => {
      if (!pinned) {
        Swift.defocus()
        return
      }
      await sleep(App.animationDuration)
      await when(() => !App.isAnimatingOrbit)
      this.focusOrbit()
    },
  ]

  @react({ delay: App.animationDuration, log: 'state' })
  defocusAfterClosing = [
    () => [Electron.orbitState.pinned, App.isShowingOrbit],
    ([pinned, showing]) => {
      if (pinned || showing || Electron.orbitState.mouseOver) {
        throw react.cancel
      }
      Swift.defocus()
    },
  ]

  @react
  focusOnMouseOver = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      if (!App.isShowingOrbit) {
        return
      }
      if (Electron.orbitState.fullScreen) {
        return
      }
      if (Electron.orbitState.pinned) {
        return
      }
      if (mouseOver) {
        this.focusOrbit()
      } else {
        Swift.defocus()
      }
    },
  ]

  handleOrbitRef = ref => {
    if (!ref) return
    if (this.orbitRef) return
    this.orbitRef = ref.window
    this.focusOrbit()
    this.props.onRef(this.orbitRef)
  }

  handleReadyToShow = () => {
    this.show = true
  }
}
