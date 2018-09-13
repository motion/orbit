import { store } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()

// @ts-ignore
@store
export class WindowFocusStore {
  props: {
    onRef: Function
  }

  show = 0
  orbitRef = null

  setOrbitRef = ref => {
    this.orbitRef = ref
  }

  focusOrbit = () => {
    if (!this.orbitRef) return
    this.orbitRef.focus()
  }

  handleOrbitRef = ref => {
    if (!ref) return
    if (this.orbitRef) return
    this.orbitRef = ref.window
    this.focusOnStart()
  }

  // focus on start
  focusOnStart() {
    if (Config.isProd) {
      this.focusOrbit()
    }
  }
}
