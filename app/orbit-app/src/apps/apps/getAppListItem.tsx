import { AppWithDefinition, isDataDefinition } from '@o/kit'
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
    icon: isDataDefinition(app.definition) ? app.definition.id : `orbit-${app.definition.id}-full`,
    iconBefore: true,
    viewType: 'settings' as 'settings',
    subId: `${app.app.id}`,
    identifier: app.app.identifier,
  }
}
