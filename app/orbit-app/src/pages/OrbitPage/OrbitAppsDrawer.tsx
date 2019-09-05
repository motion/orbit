import { createUsableStore, getAppDefinition } from '@o/kit'
import { Button, Card, FullScreen, useNodeSize, useTheme } from '@o/ui'
import { useAnimation } from 'framer-motion'
import React, { memo, useEffect, useLayoutEffect, useRef } from 'react'

import { useOm } from '../../om/om'
import { AppsDrawerStore } from './AppsDrawerStore'
import { OrbitApp } from './OrbitApp'

export const yOffset = 15

export const appsDrawerStore = createUsableStore(AppsDrawerStore)
window['appsDrawerStore'] = appsDrawerStore

const variants = {
  open: {
    y: yOffset,
    transition: { stiffness: 150, damping: 30 },
  },
  closed: {
    y: '110%',
    transition: { stiffness: 150, damping: 30 },
  },
}

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
        initial="closed"
        animate={animation}
        variants={variants}
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
