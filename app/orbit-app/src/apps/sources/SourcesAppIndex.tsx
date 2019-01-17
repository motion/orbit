import * as React from 'react'
import { AppProps } from '../AppProps'
import { addSourceClickHandler } from '../../helpers/addSourceClickHandler'
import { Icon, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { AppType } from '@mcro/models'
import SelectableList from '../../views/Lists/SelectableList'

export default observer(function SourcesAppIndex(props: AppProps<AppType.sources>) {
  const { activeSources, allSources } = props.sourcesStore
  const results = [
    ...activeSources.map(app => ({
      // only apply the click events to the active sources...
      ...props.itemProps,
      id: app.source.id,
      title: app.display.name,
      subtitle: <OrbitSourceInfo sourceId={app.source.id} app={app} />,
      icon: app.integration,
      total: activeSources.length,
      appConfig: sourceToAppConfig(app),
      group: 'Sources',
    })),
    ...allSources.map((source, index) => ({
      // ...these have their own onClick
      id: `${source.integration}${index}`,
      title: source.appName,
      icon: source.integration,
      onClick: !source.views.setup && addSourceClickHandler(source),
      disableSelect: !source.views.setup,
      after: source.views.setup ? null : (
        <View marginTop={4}>
          <Icon size={12} opacity={0.5} name="uilink6" />
        </View>
      ),
      appConfig: source.views.setup
        ? {
            ...sourceToAppConfig(source, { target: 'source' }),
            viewType: 'setup',
          }
        : null,
      group: 'Add source',
    })),
  ]

  return <SelectableList items={results} onSelect={props.onSelectItem} onOpen={props.onOpenItem} />
})
