import { sleep } from '@mcro/black'
import { Icon, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { addSource } from '../../helpers/addSourceClickHandler'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps, AppType } from '../AppTypes'

export default observer(function SourcesAppIndex(_props: AppProps) {
  const { sourcesStore } = useStoresSafe()
  const [activeSpace] = useActiveSpace()
  // const activeSpaceName = activeSpace ? activeSpace.name : ''
  const { activeSources, allSources } = sourcesStore
  const activeApps = useActiveApps()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const results = [
    {
      title: 'Manage Apps',
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
      icon: app.integration,
      iconBefore: true,
      total: activeSources.length,
      appConfig: sourceToAppConfig(app),
      group: 'Sources',
    })),
    ...allSources.map((source, index) => ({
      // ...these have their own onClick
      id: `${source.integration}${index}`,
      title: source.appName,
      icon: source.integration,
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
            title: `Opening private authentication for ${source.appName}...`,
          },
      group: 'Add source',
    })),
  ]

  return <SelectableList minSelected={0} items={results} />
})
