import { AppBit, ensure, react } from '@o/kit'
import { AnimationControls } from 'framer-motion'

import { om } from './om'
import { paneManagerStore } from './stores'

export class AppsDrawerStore {
  // @ts-ignore
  props: {
    apps: AppBit[]
    animation?: AnimationControls
  } = {
    apps: [],
  }

  isAnimating = false

  activeDrawerId = react(
    () => [this.props.apps, paneManagerStore.activePane ? +paneManagerStore.activePane.id : -1],
    ([apps, activeId]) => {
      if ((apps || []).some(x => x.id === activeId)) {
        return activeId
      }
      return -1
    },
    {
      defaultValue: -1,
    },
  )

  updateDrawerAnimation = react(
    () => [this.isOpen],
    () => {
      ensure('this.props.animation', !!this.props.animation)
      if (this.isOpen) {
        this.animateOpen()
      } else {
        this.animateClosed()
      }
    },
    {
      lazy: true,
    },
  )

  close() {
    om.actions.router.closeDrawer()
  }

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
