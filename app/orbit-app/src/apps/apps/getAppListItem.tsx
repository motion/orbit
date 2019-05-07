import { AppWithDefinition } from '@o/kit'
import { Loading } from '@o/ui'
import React, { Suspense } from 'react'

import { OrbitAppInfo } from '../../views/OrbitAppInfo'

export function getAppListItem(app: AppWithDefinition) {
  const title = app.app ? app.app.name : app.definition.name
  return {
    key: app.app ? app.app.id : app.definition.id,
    title,
    subTitle: app.definition.sync ? (
      <Suspense fallback={<Loading />}>
        <OrbitAppInfo {...app} />
      </Suspense>
    ) : null,
    icon: app.definition.sync ? app.definition.id : `orbit-${app.definition.id}-full`,
    iconBefore: true,
    viewType: 'settings' as 'settings',
    subId: `${app.app.id}`,
    identifier: app.app.identifier,
  }
}
