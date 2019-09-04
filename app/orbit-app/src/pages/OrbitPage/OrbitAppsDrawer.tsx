import { AppBit, createUsableStore, ensure, getAppDefinition, react, useForceUpdate, useReaction } from '@o/kit'
import { Button, Card, FullScreen, useNodeSize, useTheme } from '@o/ui'
import { AnimationControls, useAnimation } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { OrbitApp, whenIdle } from './OrbitApp'
import { appsCarouselStore } from './OrbitAppsCarouselStore'

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

  get activeId() {
    return paneManagerStore.activePane ? paneManagerStore.activePane.id : -1
  }

  activeIdAfterAnimating = react(
    () => this.activeId,
    async (_, { when, sleep }) => {
      await sleep(10)
      await when(() => !this.isAnimating)
      return _
    },
  )

  updateDrawerAnimation = react(
    () => [this.isOpen, this.props.height],
    () => {
      ensure('this.props.animation', !!this.props.animation)
      if (this.isOpen) {
        this.props.animation.start({ y: yOffset })
      } else {
        this.props.animation.start({ y: this.props.height + yOffset })
      }
    },
  )

  get isOpen() {
    if (paneManagerStore.activePane) {
      return this.isDrawerPage(paneManagerStore.activePane.id)
    }
    return false
  }

  isDrawerPage = (appId: string) => {
    return this.props.apps.some(x => `${x.id}` === appId)
  }

  onStartAnimate = () => {
    this.isAnimating = true
  }
  onFinishAnimate = () => {
    this.isAnimating = false
  }
}

export const appsDrawerStore = createUsableStore(AppsDrawerStore)
window['appsDrawerStore'] = appsDrawerStore

export const OrbitAppsDrawer = memo(() => {
  return null
  const forceUpdate = useForceUpdate()
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

  // this is a sort of "trickle render" to load the dock apps
  // in the backgorund, so they show before they animate open
  useReaction(
    () => [appsCarouselStore.isAnimating, appsCarouselStore.zoomedIn],
    async ([animating, zoomedIn], { sleep }) => {
      console.log('WHAT THE FUCK', animating, zoomedIn)
      ensure('not animating', !animating)
      await sleep(100)
      await whenIdle()
      for (const app of apps) {
        if (!renderApp.current[app.id!]) {
          // wait more if not zoomed in
          await sleep(zoomedIn ? 100 : 300)
          renderApp.current[app.id!] = true
          forceUpdate()
          await whenIdle()
        }
      }
    },
  )

  const renderApp = useRef({})
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
          // we avoid rendering them until after the animatino completes
          if (`${app.id}` === appsDrawer.activeIdAfterAnimating) {
            renderApp.current[app.id!] = true
          }
          const shouldRenderApp = renderApp.current[app.id!] || false
          console.log('should render', renderApp.current[app.id!])
          const shouldShow = `${app.id}` === appsDrawer.activeId
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
                shouldRenderApp={shouldRenderApp}
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
