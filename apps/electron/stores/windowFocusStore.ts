import { react, store, sleep } from '@mcro/black'
import { App, Electron, Desktop, Swift } from '@mcro/all'
import { globalShortcut } from 'electron'
import debug from '@mcro/debug'

const log = debug('OrbitWindow')

@store
export class WindowFocusStore {
  show = 0
  orbitRef = null

  setOrbitRef = ref => {
    this.orbitRef = ref
  }

  keyShortcuts = [
    ...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'Delete',
  ].map(key => ({ key, shortcut: `Option+${key}` }))

  easyPinWithLetter = react(
    () => Desktop.isHoldingOption && App.isShowingOrbit,
    async (down, { when }) => {
      await when(() => !App.isAnimatingOrbit)
      if (down) {
        for (const { key, shortcut } of this.keyShortcuts) {
          globalShortcut.register(shortcut, async () => {
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
  )

  unRegisterKeyShortcuts = () => {
    for (const { shortcut } of this.keyShortcuts) {
      globalShortcut.unregister(shortcut)
    }
  }

  focusOrbit = () => {
    if (!this.orbitRef) return
    this.orbitRef.focus()
  }

  focusOnPinned = react(
    () => App.orbitState.docked || App.orbitState.pinned,
    async (pinned, { sleep, when }) => {
      await sleep(App.animationDuration + 50)
      await when(() => !App.isAnimatingOrbit)
      if (!pinned) {
        Swift.defocus()
        return
      }
      this.focusOrbit()
    },
  )

  focusOnMouseOver = react(
    () => App.isMouseInActiveArea,
    async (mouseOver, { when }) => {
      if (!App.isShowingOrbit /* || App.orbitState.pinned*/) {
        throw react.cancel
      }
      await when(() => !App.isAnimatingOrbit)
      if (mouseOver) {
        this.focusOrbit()
      } else {
        if (App.orbitState.docked) {
          throw react.cancel
        }
        Swift.defocus()
      }
    },
  )

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
