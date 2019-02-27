import {
  AppDefinition,
  List,
  useActiveApps,
  useActiveAppsWithDefinition,
  useActiveSpace,
} from '@mcro/kit'
import * as React from 'react'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'
import { AppProps } from '../AppProps'
import { orbitApps } from '../orbitApps'

function getFeatures(def: AppDefinition) {
  const hasSync = !!def.sync
  const hasClient = !!def.app
  const titles = [hasSync ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

export function AppsIndex(_props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = orbitApps.filter(x => !!x.sync)
  const sourceAppInfo = useActiveAppsWithDefinition()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  return (
    <List
      minSelected={0}
      items={[
        ...sourceAppInfo.map(app => ({
          group: 'Apps',
          title: app.definition.name,
          subtitle: <OrbitAppInfo {...app} />,
          icon: app.definition.id,
          iconBefore: true,
          total: sourceAppInfo.length,
          appConfig: {
            viewType: 'settings' as 'settings',
            subId: `${app.app.id}`,
            identifier: app.app.identifier,
          },
        })),

        ...allSourceDefinitions.map(def => ({
          group: 'App Store',
          title: def.name,
          icon: def.id,
          iconBefore: true,
          slim: true,
          subtitle: getFeatures(def),
          appConfig: {
            identifier: 'apps',
            subType: 'add-app',
            subId: def.id,
          },
        })),
      ]}
    />
  )
}
