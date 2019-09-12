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
