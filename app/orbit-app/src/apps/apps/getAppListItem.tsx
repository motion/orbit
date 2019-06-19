import { AppIcon, AppWithDefinition } from '@o/kit'
import React, { Suspense } from 'react'

import { OrbitAppInfo } from '../../views/OrbitAppInfo'

export function getAppListItem(app: AppWithDefinition) {
  const title = app.app ? app.app.name : app.definition.name
  const identifier = (app.app && app.app.identifier) || app.definition.id
  return {
    key: `app-${app.app ? app.app.id : identifier}`,
    title,
    subTitle: app.definition.auth ? (
      <Suspense fallback={null}>
        <OrbitAppInfo {...app} />
      </Suspense>
    ) : (
      app.definition.name
    ),
    icon: <AppIcon identifier={identifier} colors={app.app.colors} />,
    viewType: 'settings' as 'settings',
    subId: `${app.app.id}`,
    identifier: app.app.identifier,
  }
}
