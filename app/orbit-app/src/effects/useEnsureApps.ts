import { AppModel, loadOne, save, useActiveSpace } from '@o/kit'
import { useEffect } from 'react'
import { orbitStaticApps } from '../apps/orbitApps'

// ensure every static app has a corresponding AppBit

export function useEnsureApps() {
  const [space, update] = useActiveSpace()

  useEffect(
    () => {
      let cancelled = false
      for (const appDef of orbitStaticApps) {
        loadOne(AppModel, { args: { where: { identifier: appDef.id } } }).then(app => {
          if (cancelled) return

          if (!app) {
            console.log('ensuring model for static app', appDef)
            save(AppModel, {
              target: 'app',
              identifier: appDef.id,
              space,
              colors: ['black', 'white'],
              tabDisplay: 'hidden',
            })
          }
        })
      }

      return () => {
        cancelled = true
      }
    },
    [update, orbitStaticApps],
  )
}
