import { AppIcon, AppWithDefinition } from '@o/kit'
import React, { Suspense } from 'react'

import { OrbitAppInfo } from '../../views/OrbitAppInfo'

export function getAppListItem(app: AppWithDefinition) {
  const title = app.app ? app.app.name : app.definition.name
  return {
    key: app.app ? app.app.id : app.definition.id,
    title,
    subTitle: app.definition.sync ? (
      <Suspense fallback={null}>
        <OrbitAppInfo {...app} />
      </Suspense>
    ) : null,
    icon: <AppIcon identifer={app.app.identifier} colors={app.app.colors} />,
    iconBefore: true,
    viewType: 'settings' as 'settings',
    subId: `${app.app.id}`,
    identifier: app.app.identifier,
  }
}
