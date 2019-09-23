import { getAppDefinition } from '@o/kit'
import { Card, FullScreen, useTheme } from '@o/ui'
import { useAnimation } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'

import { useOm } from '../../om/om'
import { appsDrawerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

const variants = {
  open: {
    x: 0,
    opacity: 1,
    // breaks
    // rotateY: '0%',
    // transition: { type: 'spring', stiffness: 500, damping: 25 },
    transition: { ease: 'easeIn', duration: 0.12 },
  },
  closed: {
    x: 20,
    opacity: 0,
    // rotateY: '10%',
    // transition: { type: 'spring', stiffness: 500, damping: 25 },
    transition: { ease: 'easeIn', duration: 0.12 },
  },
}

let tm
export const OrbitAppsDrawer = memo(() => {
  const theme = useTheme()
  const { state } = useOm()
  const apps = state.apps.activeSettingsApps
  const frameRef = useRef<HTMLElement>(null)
  const appsDrawer = appsDrawerStore.useStore()
  const activeDrawerId = appsDrawer.activeDrawerId
  const animation = useAnimation()

  useEffect(() => {
    appsDrawerStore.setProps({
      apps,
      animation,
    })
  }, [animation, apps])

  const hasDarkBackground = theme.background.isDark()

  return (
    <FullScreen
      perspective="1200px"
      pointerEvents={appsDrawer.isOpen ? 'auto' : 'none'}
      className="orbit-apps-drawer"
      // below DockBackground
      zIndex={4}
      top={15}
      left={15}
      right={70}
      bottom={15}
    >
      <Card
        nodeRef={frameRef}
        initial="closed"
        animate={animation}
        variants={variants}
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
        onUpdate={() => {
          clearTimeout(tm)
          appsDrawerStore.isAnimating = true
          tm = setTimeout(() => {
            appsDrawerStore.isAnimating = false
          }, 60)
        }}
        position="relative"
        overflow="hidden"
      >
        {apps.map(app => {
          const shouldShow = app.id === activeDrawerId
          return (
            <FullScreen
              key={app.id}
              opacity={0}
              // this fixes a really weird bug where they had wrong absolute position
              visibility="hidden"
              {...shouldShow && {
                visibility: 'visible',
                opacity: 1,
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
