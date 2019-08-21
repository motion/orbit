import { command, openItem, useStore } from '@o/kit'
import { AppDevCloseCommand, AppDevOpenCommand } from '@o/models'
import { App } from '@o/stores'
import { Icon, ListSeparator, MenuButton, Row, Toggle, useBanner } from '@o/ui'
import React, { memo } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { useAppsCarousel } from './OrbitAppsCarouselStore'
import { headerButtonProps } from './OrbitHeader'

export const OrbitHeaderOpenAppMenu = memo(
  ({ isDeveloping, setIsDeveloping }: { isDeveloping: boolean; setIsDeveloping: any }) => {
    const { state, effects } = useOm()
    const { appRole } = useStore(App)
    const banner = useBanner()

    const constantMenuItems = [
      <ListSeparator key={1000}>App</ListSeparator>,
      state.router.urlString !== 'orbit://' && {
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
    ].filter(Boolean)

    const appsCarousel = useAppsCarousel()
    const { isOnOpenableApp } = appsCarousel

    if (appRole === 'torn' || appRole === 'editing') {
      return (
        <MenuButton {...headerButtonProps} size={1} sizeRadius={1.6} items={constantMenuItems} />
      )
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
        openIconProps={{
          name: isDeveloping ? 'edit' : 'chevron-down',
        }}
        items={[
          ...(isOnOpenableApp
            ? [
                <ListSeparator key={100}>Develop</ListSeparator>,
                {
                  title: 'Edit',
                  icon: 'edit',
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
                      <Icon
                        onClick={e => {
                          e.stopPropagation()
                          openItem(`file://Users/nw/motion/orbit`)
                        }}
                        name="code"
                        tooltip="Open in VSCode"
                      />
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
