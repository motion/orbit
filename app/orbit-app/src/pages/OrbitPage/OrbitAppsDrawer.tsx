import { AppWithDefinition } from '@o/kit'
import { Card, FullScreen, useNodeSize } from '@o/ui'
import React, { memo, useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

import { usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

const yPad = 20

export const OrbitAppsDrawer = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const paneManager = usePaneManagerStore()
  const isDrawerOpen = apps.some(x => `${x.app.id}` === paneManager.activePane.id)
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef, throttle: 300 })
  const [spring, set] = useSpring(() => ({
    y: yPad,
  }))

  const updateSpring = () => {
    if (isDrawerOpen) {
      set({ y: yPad })
    } else {
      set({ y: frameSize.height })
    }
  }

  useEffect(updateSpring, [frameSize, isDrawerOpen])

  return (
    <FullScreen className="orbit-apps-drawer" ref={frameRef} pointerEvents="none">
      <Card
        alt="flat"
        background={theme => theme.backgroundStronger}
        elevation={8}
        sizeRadius={2}
        width="100%"
        height="100%"
        animated
        transform={spring.y.interpolate(y => `translate3d(0,${y}px,0)`)}
        pointerEvents="auto"
      >
        {apps.map(({ app, definition }) => {
          const isActive = `${app.id}` === paneManager.activePane.id
          return (
            <FullScreen
              key={app.id}
              bottom={yPad}
              opacity={0}
              transform={{
                y: frameSize.height,
              }}
              display="none"
              {...isActive && {
                display: 'flex',
                opacity: 1,
                transform: {
                  y: 0,
                },
              }}
            >
              <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp />
            </FullScreen>
          )
        })}
      </Card>
    </FullScreen>
  )
})
