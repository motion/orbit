import {
  AppDefinition,
  AppWithDefinition,
  Icon,
  List,
  OrbitListItemProps,
  useActiveApps,
  useActiveAppsWithDefinition,
  useActiveSpace,
} from '@mcro/kit'
import { partition } from 'lodash'
import * as React from 'react'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'
import { AppProps } from '../AppProps'
import { orbitApps } from '../orbitApps'

function getDescription(def: AppDefinition) {
  const hasSync = !!def.sync
  const hasClient = !!def.app
  const titles = [hasSync ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

function getAppItem(app: AppWithDefinition, extraProps?: OrbitListItemProps) {
  return {
    title: app.app ? app.app.name : app.definition.name,
    subtitle: app.definition.sync ? <OrbitAppInfo {...app} /> : null,
    icon: app.definition.sync ? app.definition.id : `orbit-${app.definition.id}-full`,
    iconBefore: true,
    appConfig: {
      viewType: 'settings' as 'settings',
      subId: `${app.app.id}`,
      identifier: app.app.identifier,
    },
    ...extraProps,
  }
}

export function AppsIndex(_props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = orbitApps.filter(x => !!x.sync)
  const [syncApps, clientApps] = partition(useActiveAppsWithDefinition(), x => !!x.definition.sync)

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const sourceIcon = <Icon opacity={0.5} size={20} name="database" />

  return (
    <List
      minSelected={0}
      items={[
        ...clientApps.map(x => getAppItem(x, { group: 'Apps' })),
        ...syncApps.map(x => getAppItem(x, { group: 'Sources', after: sourceIcon })),
        ...allSourceDefinitions.map(def => ({
          group: 'App Store',
          title: def.name,
          icon: def.id,
          iconBefore: true,
          slim: true,
          subtitle: getDescription(def),
          after: sourceIcon,
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
