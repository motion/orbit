import { AppWithDefinition, createUsableStore, ensure, react } from '@o/kit'
import { Card, FullScreen, isDefined, useNodeSize } from '@o/ui'
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
      if (this.isOpen && !isDefined(this.lastAppId)) {
        // default case
        return 'home'
      }
      ensure('not open', !this.isOpen)
      return activePaneId
    },
  )

  closeDrawer = () => {
    if (om.state.router.lastPage && om.state.router.lastPage.name === 'app') {
      const id = om.state.router.lastPage.params.id
      if (id && !this.isDrawerPage(id)) {
        om.actions.router.back()
        return
      }
    }
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
    y: yPad,
  }))

  useEffect(() => {
    appsDrawerStore.setProps({ apps })
  }, [apps])

  const updateSpring = () => {
    if (appsDrawer.isOpen) {
      set({ y: yPad })
    } else {
      set({ y: frameSize.height })
    }
  }

  useEffect(updateSpring, [frameSize, appsDrawer.isOpen])

  return (
    <FullScreen pointerEvents="none" className="orbit-apps-drawer">
      <Card
        ref={frameRef}
        background={theme => theme.backgroundStronger}
        elevation={8}
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
