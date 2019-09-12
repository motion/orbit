import { AppBit, ensure, react } from '@o/kit'
import { AnimationControls } from 'framer-motion'

import { paneManagerStore } from './stores'

export class AppsDrawerStore {
  // @ts-ignore
  props: {
    apps?: AppBit[]
    height?: number
    animation?: AnimationControls
  } = {
    apps: [],
    height: 0,
  }

  isAnimating = false

  activeDrawerId = react(
    () => (paneManagerStore.activePane ? +paneManagerStore.activePane.id : -1),
    activeId => {
      ensure('is a drawer app', (this.props.apps || []).some(x => x.id === activeId))
      return activeId
    },
    {
      defaultValue: -1,
    },
  )

  updateDrawerAnimation = react(
    () => [this.isOpen, this.props.height],
    () => {
      ensure('this.props.animation', !!this.props.animation)
      ensure('this.props.height', !!this.props.height)
      if (this.isOpen) {
        this.animateOpen()
      } else {
        this.animateClosed()
      }
    },
  )

  animateOpen() {
    this.props.animation!.start('open')
  }

  animateClosed() {
    this.props.animation!.start('closed')
  }

  get isOpen() {
    const id = paneManagerStore.activePane ? paneManagerStore.activePane.id : -1
    return this.isDrawerPage(+id)
  }

  isDrawerPage = (appId: number) => {
    return this.props.apps.some(x => x.id === appId)
  }
}
