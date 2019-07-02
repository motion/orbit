import { AppWithDefinition } from '@o/kit'
import { Card, FullScreen, useNodeSize, View } from '@o/ui'
import React, { memo, useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

import { usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

export const OrbitAppsDrawer = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const paneManager = usePaneManagerStore()
  const isActive = apps.some(x => x.definition.id === paneManager.activePane.id)
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef, throttle: 300 })
  const [spring, set] = useSpring(() => ({
    y: 0,
  }))

  const updateSpring = () => {
    if (isActive) {
      set({ y: 0 })
    } else {
      set({ y: frameSize.height })
    }
  }

  useEffect(updateSpring, [frameSize, isActive])

  console.log('isActive', isActive)

  return (
    <FullScreen className="orbit-apps-drawer" ref={frameRef} pointerEvents="none">
      <Card
        alt="flat"
        sizeRadius={2}
        flex={1}
        animated
        transform={spring.y.interpolate(y => `translate3d(0,${y}px,0)`)}
      >
        {apps.map(({ app, definition }) => (
          <View
            key={app.id}
            flex={1}
            opacity={0}
            transform={{
              y: frameSize.height,
            }}
            {...isActive && {
              opacity: 1,
              transform: {
                y: 0,
              },
            }}
          >
            <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp />
          </View>
        ))}
      </Card>
    </FullScreen>
  )
})
