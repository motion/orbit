import { sleep } from '@mcro/black'
import {
  List,
  OrbitListItemProps,
  useActiveApps,
  useActiveSourcesWithDefinition,
  useActiveSpace,
} from '@mcro/kit'
import { Icon, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { addSource } from '../../helpers/addSourceClickHandler'
import { AppProps } from '../AppTypes'
import { orbitApps } from '../orbitApps'

export function AppsIndex(_props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceDefinitions = orbitApps.filter(x => !!x.sync)
  const sourceInfo = useActiveSourcesWithDefinition()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  log(sourceInfo)

  const results: OrbitListItemProps[] = [
    {
      group: 'Space',
      title: `Manage apps`,
      subtitle: `${activeApps.length} apps`,
      icon: 'orbit-apps-full',
      iconBefore: true,
      appConfig: {
        appId: 'apps',
        subType: 'manage-apps',
      },
    },

    ...sourceInfo.map(app => ({
      group: 'Sources',
      // TODO once we get rid of Source model we can remove this and just use id
      subId: app.source.id,
      subType: app.definition.id,
      appId: 'sources',
      title: app.definition.name,
      subtitle: <OrbitSourceInfo {...app} />,
      icon: app.definition.icon,
      iconBefore: true,
      total: sourceInfo.length,
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
            appId: def.id,
            viewType: 'setup' as 'setup',
          }
        : {
            appId: 'message',
            viewType: 'main' as 'main',
            title: `Opening private authentication for ${def.name}...`,
          },
    })),
  ]

  return <List minSelected={0} items={results} />
}
