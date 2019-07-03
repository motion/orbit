import { AppWithDefinition, createUsableStore, ensure, react } from '@o/kit'
import { Card, FullScreen, useNodeSize } from '@o/ui'
import React, { memo, useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

import { om } from '../../om/om'
import { paneManagerStore, usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

const yPad = 20

class AppsDrawerStore {
  props: {
    apps: AppWithDefinition[]
  } = {
    apps: [],
  }

  lastAppId = react(
    () => [paneManagerStore.activePane.id, this.isOpen],
    ([activePaneId]) => {
      ensure('not open', !this.isOpen)
      return activePaneId
    },
  )

  closeDrawer = () => {
    om.actions.router.showAppPage({ id: this.lastAppId })
  }

  get isOpen() {
    return this.isDrawerPage(paneManagerStore.activePane.id)
  }

  isDrawerPage = (appId: string) => {
    return this.props.apps.some(x => `${x.app.id}` === appId)
  }
}

export const appsDrawerStore = createUsableStore(AppsDrawerStore)
window['appsDrawerStore'] = appsDrawerStore

export const OrbitAppsDrawer = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const paneManager = usePaneManagerStore()
  const appsDrawer = appsDrawerStore.useStore()
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef, throttle: 300 })
  const [spring, set] = useSpring(() => ({
    // start offscreen
    y: 10000,
  }))

  useEffect(() => {
    appsDrawerStore.setProps({ apps })
  }, [apps])

  const boxShadowSize = 20

  const updateSpring = () => {
    console.log('set it to', appsDrawer.isOpen, yPad)
    if (appsDrawer.isOpen) {
      set({ y: yPad })
    } else {
      set({ y: frameSize.height + boxShadowSize })
    }
  }

  useEffect(updateSpring, [frameSize, appsDrawer.isOpen])

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
                z: 0,
              }}
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
              <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp />
            </FullScreen>
          )
        })}
      </Card>
    </FullScreen>
  )
})
