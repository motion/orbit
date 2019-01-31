import { sleep } from '@mcro/black'
import { AppType } from '@mcro/models'
import { Icon, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { addSource } from '../../helpers/addSourceClickHandler'
import { useActiveApps } from '../../hooks/useActiveApps'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default observer(function SourcesAppIndex(props: AppProps<AppType.sources>) {
  const { activeSources, allSources } = props.sourcesStore
  const activeApps = useActiveApps()
  const results = [
    {
      title: 'Manage apps',
      subtitle: `${activeApps.map(x => x.name).join(', ')}`,
      icon: 'orbit-apps-full',
      iconBefore: true,
      iconSize: 12,
      type: AppType.apps,
    },
    ...activeSources.map(app => ({
      // only apply the click events to the active sources...
      ...props.itemProps,
      id: app.source.id,
      title: app.display.name,
      subtitle: <OrbitSourceInfo sourceId={app.source.id} app={app} />,
      icon: app.integration,
      iconBefore: true,
      total: activeSources.length,
      appConfig: sourceToAppConfig(app),
      group: 'Active Sources',
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
            viewType: 'setup',
          }
        : {
            type: 'message',
            title: `Opening private authentication for ${source.appName}...`,
          },
      group: 'Add source',
    })),
  ]

  return <SelectableList minSelected={0} items={results} />
})
