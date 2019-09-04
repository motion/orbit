import { AppBit, createUsableStore, ensure, getAppDefinition, react } from '@o/kit'
import { Button, Card, FullScreen, useNodeSize, useTheme } from '@o/ui'
import { AnimationControls, useAnimation } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

const yOffset = 15

class AppsDrawerStore {
  // @ts-ignore
  props: {
    apps: AppBit[]
    height: number
    animation: AnimationControls
  } = {
    apps: [],
    height: 0,
  }

  isAnimating = false

  closeDrawer = () => {
    om.actions.router.closeDrawer()
  }

  activeDrawerId = react(
    () => (paneManagerStore.activePane ? +paneManagerStore.activePane.id : -1),
    activeId => {
      ensure('is a drawer app', this.props.apps.some(x => x.id === activeId))
      return activeId
    },
    {
      defaultValue: -1,
    },
  )

  transition = { stiffness: 150, damping: 30 }

  updateDrawerAnimation = react(
    () => [this.isOpen, this.props.height],
    () => {
      console.log('is open?', this.isOpen)
      ensure('this.props.animation', !!this.props.animation)
      if (this.isOpen) {
        this.props.animation.start({ y: yOffset, transition: this.transition })
      } else {
        this.props.animation.start({ y: this.props.height + yOffset, transition: this.transition })
      }
    },
  )

  get isOpen() {
    const id = paneManagerStore.activePane ? paneManagerStore.activePane.id : -1
    return this.isDrawerPage(+id)
  }

  isDrawerPage = (appId: number) => {
    return this.props.apps.some(x => x.id === appId)
  }
}

export const appsDrawerStore = createUsableStore(AppsDrawerStore)
window['appsDrawerStore'] = appsDrawerStore

export const OrbitAppsDrawer = memo(() => {
  const theme = useTheme()
  const { state } = useOm()
  const apps = state.apps.activeSettingsApps
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef, throttle: 300 })
  const height = frameSize.height
  const appsDrawer = appsDrawerStore.useStore()
  const animation = useAnimation()

  useEffect(() => {
    appsDrawerStore.setProps({
      apps,
      height,
      animation,
    })
  }, [animation, apps, height])

  const hasDarkBackground = theme.background.isDark()

  return (
    <FullScreen pointerEvents="none" className="orbit-apps-drawer" zIndex={1000}>
      <Card
        nodeRef={frameRef}
        background={theme.backgroundStronger}
        boxShadow={[
          {
            blur: hasDarkBackground ? 10 : 5,
            color: [0, 0, 0, hasDarkBackground ? 0.5 : 0.1],
          },
        ]}
        sizeRadius={2}
        borderWidth={0}
        width="100%"
        height="100%"
        animate={animation}
        pointerEvents="auto"
        position="relative"
        overflow="hidden"
      >
        <DrawerCloseButton />
        {apps.map(app => {
          const shouldShow = app.id === appsDrawer.activeDrawerId
          return (
            <FullScreen
              key={app.id}
              bottom={yOffset}
              opacity={0}
              transform={{
                y: frameSize.height,
                z: 0,
              }}
              // this fixes a really weird bug where they had wrong absolute position
              visibility="hidden"
              {...shouldShow && {
                visibility: 'visible',
                opacity: 1,
                transform: {
                  y: 0,
                  z: 0,
                },
              }}
            >
              <OrbitApp
                id={app.id!}
                identifier={app.identifier!}
                appDef={getAppDefinition(app.identifier!)}
                shouldRenderApp
              />
            </FullScreen>
          )
        })}
      </Card>
    </FullScreen>
  )
})

const DrawerCloseButton = memo(() => {
  return null
  return (
    <Button
      zIndex={1000}
      position="absolute"
      onClick={appsDrawerStore.closeDrawer}
      top={5}
      right={5}
      size="sm"
      alt="flat"
      circular
      icon="cross"
    />
  )
})
