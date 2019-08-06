import { command, useReaction, useStore } from '@o/kit'
import { AppDevOpenCommand } from '@o/models'
import { App, Desktop } from '@o/stores'
import { MenuButton, Toggle } from '@o/ui'
import React, { memo, useState } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { useAppsCarousel } from './OrbitAppsCarousel'

export const OrbitHeaderOpenAppMenu = memo(() => {
  const { state, effects } = useOm()
  const { appRole } = useStore(App)
  const [isDeveloping, setIsDeveloping] = useState(false)

  useReaction(
    () => [
      appsCarousel.focusedApp.identifier!,
      Desktop.state.workspaceState.developingAppIdentifiers,
    ],
    ([identifier, developingAppIdentifiers]) => {
      console.log('update toggle', developingAppIdentifiers, identifier)
      // @ts-ignore why is typescript not passing types down here... see ReactVal (it works with react())
      setIsDeveloping(developingAppIdentifiers.some(x => x === identifier))
    },
  )

  // TODO we should move all this state to the datbase and out of Desktop.workspaceState.developingApps etc
  // that gives us a few things:
  //  1. it will have optimistic updating in the UI here for the toggling with no duplicate logic
  //  2. it will be a nicer way to sync state between the frontend/backend
  //  3. it persists the state across startups (we could easily clear it too), which may not be desirable, but at least it's an option
  // const { isOnOpenableApp, focusedApp } = useAppsCarousel()
  // const [menuState, setMenuState] = useAppState(orbitAppStateId(focusedApp.id), {
  //   isEditing
  // })

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
                onClick: e => {
                  e.stopPropagation()
                  // toggle
                  setIsDeveloping(x => !x)
                  command(AppDevOpenCommand, {
                    type: 'workspace',
                    appId: appsCarousel.focusedApp.id!,
                    identifier: appsCarousel.focusedApp.identifier!,
                  })
                },
                after: <Toggle checked={isDeveloping} />,
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
