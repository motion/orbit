import { command, openItem, useReaction, useStore } from '@o/kit'
import { AppDevCloseCommand, AppDevOpenCommand } from '@o/models'
import { App } from '@o/stores'
import { Button, ListSeparator, MenuButton, Row, Toggle, useBanner, useDebounceValue } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { useAppsCarousel } from './OrbitAppsCarouselStore'
import { appsDrawerStore } from './OrbitAppsDrawer'
import { headerButtonProps } from './OrbitHeader'

export const OrbitHeaderOpenAppMenu = memo(
  ({ isDeveloping, setIsDeveloping }: { isDeveloping: boolean; setIsDeveloping: any }) => {
    const { state, effects } = useOm()
    const { appRole } = useStore(App)
    const banner = useBanner()
    const appsCarousel = useAppsCarousel({ react: false })
    const disabled = useReaction(() => {
      return appsCarousel.focusedApp.identifier === 'setupApp' || appsDrawerStore.isOpen
    })

    const isOnOpenableApp = useDebounceValue(appsCarousel.isOnOpenableApp, 300)

    const constantMenuItemsFast = useMemo(
      () =>
        [
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
        ].filter(Boolean),
      [state.router.urlString],
    )
    const constantMenuItems = useDebounceValue(constantMenuItemsFast, 300)

    const items = useMemo(() => {
      return [
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
                    <Button
                      alt="flat"
                      margin={-4}
                      sizeIcon={1.2}
                      size="sm"
                      onClick={e => {
                        e.stopPropagation()
                        openItem(`/Users/nw/motion/orbit`)
                      }}
                      icon="code"
                      circular
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
      ]
    }, [isDeveloping, isOnOpenableApp, constantMenuItems])

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
        disabled={disabled}
        opacity={disabled ? 0.5 : 1}
        openIconProps={useMemo(
          () => ({
            name: isDeveloping ? 'edit' : 'chevron-down',
          }),
          [isDeveloping],
        )}
        items={items}
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
