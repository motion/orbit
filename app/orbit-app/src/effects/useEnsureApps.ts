import { AppModel, loadOne, save, useActiveSpace } from '@o/kit'
import { useEffect } from 'react'

import { orbitStaticApps } from '../apps/orbitApps'

// ensure every static app has a corresponding AppBit

export function useEnsureApps() {
  const [space, update] = useActiveSpace()

  useEffect(() => {
    let cancelled = false
    for (const appDef of orbitStaticApps) {
      loadOne(AppModel, { args: { where: { identifier: appDef.id } } }).then(app => {
        if (cancelled) return

        if (!app) {
          console.log('ensuring model for static app', appDef)
          save(AppModel, {
            name: appDef.name,
            target: 'app',
            identifier: appDef.id,
            spaceId: space.id,
            colors: ['black', 'white'],
            tabDisplay: 'hidden',
          })
        }
      })
    }

    // ensure we have a dummy postgres app too
    loadOne(AppModel, {
      args: { where: { identifier: 'postgres', name: 'Postgres on docker' } },
    }).then(app => {
      if (cancelled || app) return

      save(AppModel, {
        colors: [],
        createdAt: new Date(),
        identifier: 'postgres',
        name: 'Postgres on docker',
        sourceIdentifier: '',
        tabDisplay: 'plain',
        target: 'app',
        token: '',
        spaceId: space.id,
        data: {
          credentials: {
            hostname: 'localhost',
            database: 'test',
            username: 'postgres',
            password: 'test',
          },
        } as any,
      })
    })

    return () => {
      cancelled = true
    }
  }, [update, orbitStaticApps])
}
