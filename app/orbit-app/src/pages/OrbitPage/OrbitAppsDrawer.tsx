import { getAppDefinition } from '@o/kit'
import { Card, FullScreen, useNodeSize, useTheme } from '@o/ui'
import { useAnimation } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'

import { useOm } from '../../om/om'
import { appsDrawerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

const variants = {
  open: {
    y: 0,
    opacity: 1,
    rotateX: '0%',
    transition: { stiffness: 150, damping: 30 },
  },
  closed: {
    y: '20%',
    opacity: 0,
    rotateX: '10%',
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
    <FullScreen
      perspective="1200px"
      pointerEvents="none"
      className="orbit-apps-drawer"
      zIndex={1000}
      top={20}
      left={20}
      right={60}
      bottom={20}
    >
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
        pointerEvents={appsDrawer.isOpen ? 'auto' : 'none'}
        position="relative"
        overflow="hidden"
      >
        {apps.map(app => {
          const shouldShow = app.id === appsDrawer.activeDrawerId
          return (
            <FullScreen
              key={app.id}
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
