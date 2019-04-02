import { AppWithDefinition, OrbitListItemProps } from '@o/kit'
import React from 'react'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'

export function getAppListItem(app: AppWithDefinition, extraProps?: OrbitListItemProps) {
  const title = app.app ? app.app.name : app.definition.name
  return {
    title,
    subTitle: app.definition.sync ? <OrbitAppInfo {...app} /> : null,
    icon: app.definition.sync ? app.definition.id : `orbit-${app.definition.id}-full`,
    iconBefore: true,
    viewType: 'settings' as 'settings',
    subType: app.definition.sync ? 'sync' : 'app',
    subId: `${app.app.id}`,
    identifier: app.app.identifier,
    ...extraProps,
  }
}
