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
          // {
          //   group: 'Settings',
          //   title: 'Manage Apps',
          //   subtitle: 'Manage space apps',
          //   icon: 'orbit-apps-full',
          //   iconBefore: true,
          //   subType: 'manage',
          // },
          ...clientApps.map(x => getAppListItem(x, { group: 'App Settings' })),
          ...syncApps.map(x => getAppListItem(x, { group: 'Source Settings', after: sourceIcon })),
          ...allSourceDefinitions.map(def => ({
            group: 'Install App',
            title: def.name,
            icon: def.id,
            iconBefore: true,
            small: true,
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
    </>
  )
}
