import { react, store } from '@mcro/black'
import { App, Swift } from '@mcro/stores'
// @ts-ignore
import ElectronNode from 'electron'

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

  // disable easy pin with letter while sidebar disabled
  // easyPinWithLetter = react(
  //   () => Desktop.isHoldingOption && App.isShowingOrbit,
  //   async (down, { when }) => {
  //     await when(() => !App.isAnimatingOrbit)
  //     if (down) {
  //       for (const { key, shortcut } of this.keyShortcuts) {
  //         // @ts-ignore
  //         ElectronNode.globalShortcut.register(shortcut, async () => {
  //           // TYPE THE KEY
  //           Electron.sendMessage(App, `${App.messages.PIN}-${key}`)
  //           // FOCUS
  //           this.focusOrbit()
  //           // then register shortcuts
  //           await when(() => !Desktop.isHoldingOption)
  //           this.unRegisterKeyShortcuts()
  //         })
  //       }
  //     } else {
  //       await when(() => !Desktop.isHoldingOption)
  //       this.unRegisterKeyShortcuts()
  //     }
  //   },
  // )

  unRegisterKeyShortcuts = () => {
    for (const { shortcut } of this.keyShortcuts) {
      // @ts-ignore
      ElectronNode.globalShortcut.unregister(shortcut)
    }
  }

  focusOrbit = () => {
    if (!this.orbitRef) return
    this.orbitRef.focus()
  }

  defocusOrbit = () => {
    Swift.defocus()
  }

  unfocusOnHide = react(
    () => App.orbitState.docked || App.orbitState.pinned,
    showing => {
      if (!showing) {
        Swift.defocus()
        return
      }
    },
  )

  focusOnMouseOver = react(
    () => App.isMouseInActiveArea,
    async mouseOver => {
      if (!App.isShowingOrbit) {
        throw react.cancel
      }
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
}
