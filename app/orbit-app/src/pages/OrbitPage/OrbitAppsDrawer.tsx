import { AppBit, createUsableStore, getAppDefinition } from '@o/kit'
import { Button, Card, FullScreen, useNodeSize } from '@o/ui'
import React, { memo, useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

import { om, useOm } from '../../om/om'
import { paneManagerStore, usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

class AppsDrawerStore {
  props: {
    apps: AppBit[]
  } = {
    apps: [],
  }

  closeDrawer = () => {
    om.actions.router.closeDrawer()
  }

  get isOpen() {
    if (paneManagerStore.activePane) {
      return this.isDrawerPage(paneManagerStore.activePane.id)
    }
    return false
  }

  isDrawerPage = (appId: string) => {
    return this.props.apps.some(x => `${x.id}` === appId)
  }
}

export const appsDrawerStore = createUsableStore(AppsDrawerStore)
window['appsDrawerStore'] = appsDrawerStore

export const OrbitAppsDrawer = memo(() => {
  const { state } = useOm()
  const apps = state.apps.activeSettingsApps
  const paneManager = usePaneManagerStore()
  const appsDrawer = appsDrawerStore.useStore()
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef, throttle: 300 })
  const height = frameSize.height
  const [spring, set] = useSpring(() => ({
    // start offscreen
    y: 10000,
  }))

  useEffect(() => {
    appsDrawerStore.setProps({ apps })
  }, [apps])

  const yPad = 10
  const boxShadowSize = 20

  const updateSpring = () => {
    if (appsDrawer.isOpen) {
      set({ y: yPad })
    } else {
      set({ y: height + boxShadowSize })
    }
  }

  useEffect(updateSpring, [height, appsDrawer.isOpen])

  const renderApp = useRef({})

  return (
    <FullScreen pointerEvents="none" className="orbit-apps-drawer">
      <Card
        ref={frameRef}
        background={theme => theme.backgroundStronger}
        boxShadow={[
          {
            blur: boxShadowSize,
            color: [0, 0, 0, 0.5],
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
          const isActive = `${app.id}` === paneManager.activePane.id
          if (isActive) {
            renderApp.current[app.id!] = true
          }
          return (
            <FullScreen
              key={app.id}
              bottom={yPad}
              opacity={0}
              transform={{
                y: frameSize.height,
                z: 0,
              }}
              // this fixes a really weird bug where they had wrong absolute position
              visibility="hidden"
              {...isActive && {
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
                renderApp={isActive}
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
