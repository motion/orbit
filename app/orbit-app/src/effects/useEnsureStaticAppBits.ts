import { AppModel, loadOne, save, useActiveSpace } from '@o/kit'
import { useEffect } from 'react'

import { useStaticAppDefinitions } from '../apps/orbitApps'

// ensure every static app has a corresponding AppBit

export function useEnsureStaticAppBits() {
  const [space] = useActiveSpace()
  const appDefs = useStaticAppDefinitions()

  useEffect(() => {
    let cancelled = false
    for (const appDef of appDefs) {
      loadOne(AppModel, { args: { where: { identifier: appDef.id } } }).then(app => {
        if (cancelled) return

        if (!app) {
          console.log('ensuring model for static app', appDef)
          save(AppModel, {
            name: appDef.name,
            target: 'app',
            identifier: appDef.id,
            spaceId: space.id,
            icon: appDef.icon,
            colors: ['black', 'white'],
            tabDisplay: 'hidden',
          })
        }
      })
    }

    return () => {
      cancelled = true
    }
  }, [space, appDefs])
}
