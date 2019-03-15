import {
  AppDefinition,
  AppWithDefinition,
  Icon,
  List,
  OrbitListItemProps,
  useActiveApps,
  useActiveAppsWithDefinition,
  useActiveSpace,
  useActiveSyncAppsWithDefinition,
  useAppDefinitions,
} from '@o/kit'
import * as React from 'react'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'

function getDescription(def: AppDefinition) {
  const hasSync = !!def.sync
  const hasClient = !!def.app
  const titles = [hasSync ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

function getAppItem(app: AppWithDefinition, extraProps?: OrbitListItemProps) {
  const title = app.app ? app.app.name : app.definition.name
  return {
    title,
    subtitle: app.definition.sync ? <OrbitAppInfo {...app} /> : null,
    icon: app.definition.sync ? app.definition.id : `orbit-${app.definition.id}-full`,
    iconBefore: true,
    appProps: {
      title,
      viewType: 'settings' as 'settings',
      subType: app.definition.sync ? 'sync' : 'app',
      subId: `${app.app.id}`,
      identifier: app.app.identifier,
    },
    ...extraProps,
  }
}

export function AppsIndex() {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = useAppDefinitions().filter(x => !!x.sync)
  const clientApps = useActiveAppsWithDefinition().filter(x => !x.definition.sync)
  const syncApps = useActiveSyncAppsWithDefinition()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const sourceIcon = <Icon opacity={0.5} size={20} name="database" />

  return (
    <List
      items={[
        {
          group: 'Settings',
          title: 'Manage Apps',
          subtitle: 'Manage space apps',
          icon: 'orbit-apps-full',
          iconBefore: true,
          subType: 'manage',
        },
        ...clientApps.map(x => getAppItem(x, { group: 'App Settings' })),
        ...syncApps.map(x => getAppItem(x, { group: 'Source Settings', after: sourceIcon })),
        ...allSourceDefinitions.map(def => ({
          group: 'Install App',
          title: def.name,
          icon: def.id,
          iconBefore: true,
          slim: true,
          subtitle: getDescription(def),
          after: sourceIcon,
          appProps: {
            identifier: 'apps',
            subType: 'add-app',
            subId: def.id,
          },
        })),
      ]}
    />
  )
}
