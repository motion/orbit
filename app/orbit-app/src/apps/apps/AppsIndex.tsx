import { sleep } from '@mcro/black'
import {
  List,
  OrbitListItemProps,
  useActiveApps,
  useActiveSpace,
  useActiveSyncAppsWithDefinition,
} from '@mcro/kit'
import { Icon, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'
import { addSource } from '../../helpers/addAppClickHandler'
import { AppProps } from '../AppProps'
import { orbitApps } from '../orbitApps'

export function AppsIndex(_props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = orbitApps.filter(x => !!x.sync)
  const sourceAppInfo = useActiveSyncAppsWithDefinition()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const results: OrbitListItemProps[] = [
    // {
    //   group: 'Space',
    //   title: `Manage apps`,
    //   subtitle: `${activeApps.length} apps`,
    //   icon: 'orbit-apps-full',
    //   iconBefore: true,
    //   appConfig: {
    //     identifier: 'apps',
    //     subType: 'manage-apps',
    //   },
    // },

    ...sourceAppInfo.map(app => ({
      group: 'Apps',
      subId: app.app.id,
      identifier: 'apps',
      title: app.definition.name,
      subtitle: <OrbitAppInfo {...app} />,
      icon: app.definition.icon,
      iconBefore: true,
      total: sourceAppInfo.length,
    })),

    ...allSourceDefinitions.map(def => ({
      group: 'Add Source',
      title: def.name,
      icon: def.icon,
      onClick:
        !def.sync.setup &&
        (async e => {
          e.preventDefault()
          e.stopPropagation()
          await sleep(700)
          addSource(def)
        }),
      // disableSelect: !source.views.setup,
      after: def.sync.setup ? null : (
        <View marginTop={4}>
          <Icon size={12} opacity={0.5} name="uilink6" />
        </View>
      ),
      appConfig: def.sync.setup
        ? {
            identifier: 'apps',
            subId: def.id,
            viewType: 'setup' as 'setup',
          }
        : {
            identifier: 'message',
            viewType: 'main' as 'main',
            icon: def.icon,
            title: `Opening private authentication for ${def.name}...`,
          },
    })),
  ]

  return <List minSelected={0} items={results} />
}
