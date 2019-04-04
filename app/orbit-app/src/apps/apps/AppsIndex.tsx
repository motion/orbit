import {
  AppDefinition,
  Icon,
  List,
  useActiveApps,
  useActiveAppsWithDefinition,
  useActiveSpace,
  useActiveSyncAppsWithDefinition,
  useAppDefinitions,
} from '@o/kit'
import { TitleRow } from '@o/ui'
import * as React from 'react'
import { getAppListItem } from './getAppListItem'

function getDescription(def: AppDefinition) {
  const hasSync = !!def.sync
  const hasClient = !!def.app
  const titles = [hasSync ? 'Data Source' : '', hasClient ? 'Client' : ''].filter(Boolean)
  return titles.join(', ')
}

const sourceIcon = <Icon opacity={0.5} size={20} name="database" />

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
    <>
      <TitleRow bordered title="Manage Apps" subTitle="Search to find new apps to install" />
      <List
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
            appProps: {
              identifier: 'apps',
              subType: 'add-app',
              subId: def.id,
            },
          })),
        ]}
      />
    </>
  )
}
