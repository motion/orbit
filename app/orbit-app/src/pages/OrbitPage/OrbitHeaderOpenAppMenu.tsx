import { command, useStore } from '@o/kit'
import { AppDevCloseCommand, AppDevOpenCommand } from '@o/models'
import { App } from '@o/stores'
import { Icon, MenuButton, Row, Toggle, useBanner } from '@o/ui'
import React, { memo } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { useAppsCarousel } from './OrbitAppsCarousel'

export const OrbitHeaderOpenAppMenu = memo(
  ({ isDeveloping, setIsDeveloping }: { isDeveloping: boolean; setIsDeveloping: any }) => {
    const { state, effects } = useOm()
    const { appRole } = useStore(App)
    const banner = useBanner()

    const constantMenuItems = [
      {
        separator: 'App',
        title: 'Permalink',
        subTitle: state.router.urlString,
        icon: 'link',
        onClick: effects.copyAppLink,
      },
      {
        title: 'App Settings',
        icon: 'cog',
        onClick: goToAppSettings,
      },
    ]

    const appsCarousel = useAppsCarousel()
    const { isOnOpenableApp } = appsCarousel

    if (appRole === 'editing') {
      return (
        <MenuButton
          alt="action"
          size={1}
          sizeRadius={1.6}
          onClick={() => {
            console.warn('Should send orbit build command, then run it in production')
          }}
          items={[...constantMenuItems]}
        >
          Preview
        </MenuButton>
      )
    }

    if (appRole === 'torn') {
      return <MenuButton size={1} sizeRadius={1.6} items={constantMenuItems} />
    }

    return (
      <MenuButton
        alt="action"
        size={1}
        sizeRadius={1.6}
        tooltip="Open to desktop (⌘ + ⏎)"
        onClick={effects.openCurrentApp}
        elevation={3}
        elevationShadowOpacity={0.2}
        items={[
          ...(isOnOpenableApp
            ? [
                {
                  title: 'Edit',
                  icon: 'edit',
                  separator: 'Develop',
                  onClick: async e => {
                    e.stopPropagation()
                    // toggle
                    banner.set({
                      type: 'info',
                      message: `Updating...`,
                      timeout: 1.5,
                    })
                    let reply: any = null
                    setIsDeveloping(x => !x)
                    if (isDeveloping === false) {
                      reply = await command(AppDevOpenCommand, {
                        type: 'workspace',
                        appId: appsCarousel.focusedApp.id!,
                        identifier: appsCarousel.focusedApp.identifier!,
                      })
                    } else {
                      reply = await command(AppDevCloseCommand, {
                        identifier: appsCarousel.focusedApp.identifier!,
                      })
                    }
                    banner.set({
                      type: reply.type,
                      message: reply.message,
                      timeout: 1.5,
                    })
                  },
                  after: (
                    <Row space>
                      <Toggle checked={isDeveloping} />
                      <Icon name="open" tooltip="Open in VSCode" />
                    </Row>
                  ),
                },
                {
                  title: 'Fork',
                  icon: 'fork',
                },
                {
                  title: 'Publish',
                  icon: 'export',
                },
              ]
            : []),
          ...constantMenuItems,
        ]}
      >
        Open
      </MenuButton>
    )
  },
)

const goToAppSettings = () => {
  om.actions.router.showAppPage({
    id: 'apps',
    subId: paneManagerStore.activePane.id,
  })
}
