import { AppBit, createUsableStore, getAppDefinition, react, useForceUpdate } from '@o/kit'
import { Button, Card, FullScreen, idFn, sleep, useNodeSize, useTheme } from '@o/ui'
import React, { memo, useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { OrbitApp, whenIdle } from './OrbitApp'

const boxShadowSize = 20

class AppsDrawerStore {
  props: {
    apps: AppBit[]
    height: number
    springSet: Function
  } = {
    height: 0,
    apps: [],
    springSet: idFn,
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
      if (this.isOpen) {
        this.props.springSet({ y: boxShadowSize })
      } else {
        this.props.springSet({ y: this.props.height + boxShadowSize })
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
  const forceUpdate = useForceUpdate()
  const theme = useTheme()
  const { state } = useOm()
  const apps = state.apps.activeSettingsApps
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef, throttle: 300 })
  const height = frameSize.height
  const appsDrawer = appsDrawerStore.useStore()
  const [spring, springSet] = useSpring(() => ({
    // start offscreen
    y: window.innerHeight * 1.5,
    onRest: appsDrawerStore.onFinishAnimate,
    onStart: appsDrawerStore.onStartAnimate,
  }))

  useEffect(() => {
    appsDrawerStore.setProps({
      apps,
      height,
      springSet,
    })
  }, [springSet, apps, height])

  // this is a sort of "trickle render" to load the dock apps
  // in the backgorund, so they show before they animate open
  useEffect(() => {
    let cancelled = false
    const tm = setTimeout(async () => {
      for (const app of apps) {
        if (cancelled) continue
        // make sure its pretty idle
        await whenIdle()
        await sleep(10)
        await whenIdle()
        await sleep(10)
        await whenIdle()
        renderApp.current[app.id!] = true
        forceUpdate()
        await sleep(300)
      }
    }, 2000)
    return () => {
      cancelled = true
      clearTimeout(tm)
    }
  }, [apps])

  const renderApp = useRef({})
  const hasDarkBackground = theme.background.isDark()

  return (
    <FullScreen pointerEvents="none" className="orbit-apps-drawer" zIndex={1000}>
      <Card
        ref={frameRef}
        background={theme.backgroundStronger}
        boxShadow={[
          {
            blur: boxShadowSize,
            color: [0, 0, 10, hasDarkBackground ? 0.5 : 0.1],
          },
        ]}
        sizeRadius={2}
        borderWidth={0}
        width="100%"
        height="100%"
        animated
        transform={spring.y.to(y => `translate3d(0,${y}px,0)`)}
        pointerEvents="auto"
        position="relative"
      >
        <DrawerCloseButton />
        {apps.map(app => {
          // we avoid rendering them until after the animatino completes
          const shouldRender = `${app.id}` === appsDrawer.activeIdAfterAnimating
          if (shouldRender) {
            renderApp.current[app.id!] = true
          }
          const shouldRenderApp = renderApp.current[app.id!]
          const shouldShow = `${app.id}` === appsDrawer.activeId
          return (
            <FullScreen
              key={app.id}
              bottom={boxShadowSize}
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
