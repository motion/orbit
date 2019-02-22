import { sleep } from '@mcro/black'
import { AppType, List, sourceToAppConfig, useActiveApps, useActiveSpace } from '@mcro/kit'
import { Icon, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { addSource } from '../../helpers/addSourceClickHandler'
import { useStores } from '../../hooks/useStores'
import { AppProps } from '../AppTypes'

export default function SourcesAppIndex(_props: AppProps) {
  const { sourcesStore } = useStores()
  const [activeSpace] = useActiveSpace()
  const { activeSources, allSources } = sourcesStore
  const activeApps = useActiveApps()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const results = [
    {
      title: 'Apps',
      icon: 'orbit-apps-full',
      iconBefore: true,
      iconSize: 12,
      appConfig: {
        type: AppType.sources,
        subType: 'manage-apps',
      },
    },
    ...activeSources.map(app => ({
      id: `${app.source.id}`,
      title: app.display.name,
      subtitle: <OrbitSourceInfo sourceId={app.source.id} app={app} />,
      icon: app.source,
      iconBefore: true,
      total: activeSources.length,
      appConfig: sourceToAppConfig(app),
      group: 'Sources',
    })),
    ...allSources.map((source, index) => ({
      // ...these have their own onClick
      id: `${source.source}${index}`,
      title: source.name,
      icon: source.source,
      onClick:
        !source.views.setup &&
        (async e => {
          e.preventDefault()
          e.stopPropagation()
          await sleep(700)
          addSource(source)
        }),
      // disableSelect: !source.views.setup,
      after: source.views.setup ? null : (
        <View marginTop={4}>
          <Icon size={12} opacity={0.5} name="uilink6" />
        </View>
      ),
      appConfig: source.views.setup
        ? {
            ...sourceToAppConfig(source),
            type: AppType.sources,
            viewType: 'setup' as 'setup',
          }
        : {
            type: AppType.message,
            title: `Opening private authentication for ${source.name}...`,
          },
      group: 'Add source',
    })),
  ]

  return <List minSelected={0} items={results} />
}
