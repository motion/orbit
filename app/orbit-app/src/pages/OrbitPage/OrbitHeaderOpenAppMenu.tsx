import { command, useStore } from '@o/kit'
import { AppDevOpenCommand } from '@o/models'
import { App } from '@o/stores'
import { MenuButton } from '@o/ui'
import React, { memo } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { useAppsCarousel } from './OrbitAppsCarousel'

export const OrbitHeaderOpenAppMenu = memo(() => {
  const { state, effects } = useOm()
  const { appRole } = useStore(App)

  const constantMenuItems = [
    {
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
      elevation={8}
      items={[
        ...(isOnOpenableApp
          ? [
              {
                title: 'Edit',
                icon: 'edit',
                onClick: () => {
                  command(AppDevOpenCommand, {
                    type: 'workspace',
                    appId: appsCarousel.focusedApp.id!,
                    identifier: appsCarousel.focusedApp.identifier!,
                  })
                },
              },
              {
                title: 'Fork',
                icon: 'fork',
              },
            ]
          : []),
        ...constantMenuItems,
      ]}
    >
      Open
    </MenuButton>
  )
})

const goToAppSettings = () => {
  om.actions.router.showAppPage({
    id: 'apps',
    subId: paneManagerStore.activePane.id,
  })
}
