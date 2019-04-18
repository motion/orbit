import {
  AppDefinition,
  Icon,
  useActiveApps,
  useActiveAppsWithDefinition,
  useActiveSpace,
  useActiveSyncAppsWithDefinition,
  useAppDefinitions,
} from '@o/kit'
import { List } from '@o/ui'
import * as React from 'react'
import { getAppListItem } from './getAppListItem'

function getDescription(def: AppDefinition) {
  const hasSync = !!def.sync
  const hasClient = !!def.app
  const titles = [hasSync ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

const sourceIcon = <Icon opacity={0.5} size={12} name="database" />

export function AppsIndex() {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = useAppDefinitions().filter(x => !!x.sync)
  const clientApps = useActiveAppsWithDefinition().filter(x => !x.definition.sync)
  const syncApps = useActiveSyncAppsWithDefinition()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  return (
    <List
      title="Manage Apps"
      subTitle="Use search to find new apps."
      items={[
        ...clientApps.map(getAppListItem).map(x => ({ ...x, group: 'App Settings' })),
        ...syncApps.map(getAppListItem).map(x => ({
          ...x,
          group: 'Source Settings',
          after: sourceIcon,
        })),
        ...allSourceDefinitions.map(def => ({
          key: `install-${def.id}`,
          group: 'Install App',
          title: def.name,
          icon: def.id,
          iconBefore: true,
          small: true,
          subTitle: getDescription(def) || 'No Description',
          after: sourceIcon,
          extraData: {
            identifier: 'apps',
            subType: 'add-app',
            subId: def.id,
          },
        })),
      ]}
    />
  )
}
