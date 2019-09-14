import { AppBit } from '@o/models'
import { ListItemProps, SimpleText } from '@o/ui'
import React from 'react'

import { AppIcon } from '../views/AppIcon'
import { getAppDefinition } from './getAppDefinition'

export const appToListItem = (app: AppBit, index: number): ListItemProps => {
  return {
    key: `${app.id}`,
    title: app.name,
    icon: <AppIcon identifier={app.identifier} colors={app.colors} />,
    after: (
      <SimpleText alignSelf="center" alpha={0.5} size={1.1}>
        ⌘ + {index + 2}
      </SimpleText>
    ),
    groupName: 'Apps',
    extraData: {
      id: `${app.id}`,
      identifier: 'message',
      icon: getAppDefinition(app.identifier) ? getAppDefinition(app.identifier)!.icon : '',
      title: `Open ${app.name}`,
      subTitle: 'Command: ⮐',
      app,
    },
  }
}
