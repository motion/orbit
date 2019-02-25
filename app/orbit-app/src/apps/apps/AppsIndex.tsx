import { sleep } from '@mcro/black'
import { List, useActiveApps, useActiveSources, useActiveSpace } from '@mcro/kit'
import { Icon, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { addSource } from '../../helpers/addSourceClickHandler'
import { AppProps } from '../AppTypes'
import { orbitApps } from '../orbitApps'

export function AppsIndex(_props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()
  const allSourceApps = orbitApps.filter(x => !!x.app.sync)
  const activeSources = useActiveSources().map(source => ({
    ...orbitApps.find(app => app.id === source.type),
    source,
  }))

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const results = [
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

    ...activeSources.map(app => ({
      group: 'Sources',
      id: `${app.source.id}`,
      title: app.app.name,
      subtitle: <OrbitSourceInfo sourceId={app.source.id} app={app} />,
      icon: app.source,
      iconBefore: true,
      total: activeSources.length,
    })),

    ...allSourceApps.map(app => ({
      group: 'Add Source',
      id: `${app.id}`,
      title: app.app.name,
      icon: app.app.icon,
      onClick:
        !app.app.sync.setup &&
        (async e => {
          e.preventDefault()
          e.stopPropagation()
          await sleep(700)
          addSource(app)
        }),
      // disableSelect: !source.views.setup,
      after: app.app.sync.setup ? null : (
        <View marginTop={4}>
          <Icon size={12} opacity={0.5} name="uilink6" />
        </View>
      ),
      appConfig: app.app.sync.setup
        ? {
            appId: 'sources',
            viewType: 'setup' as 'setup',
          }
        : {
            appId: 'message',
            title: `Opening private authentication for ${app.app.name}...`,
          },
    })),
  ]

  return <List minSelected={0} items={results} />
}
