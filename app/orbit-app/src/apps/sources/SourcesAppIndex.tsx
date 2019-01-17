import * as React from 'react'
import { AppProps } from '../AppProps'
import { addSourceClickHandler } from '../../helpers/addSourceClickHandler'
import { Icon, Text, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'
import { AppType } from '@mcro/models'
import SelectableList from '../../views/Lists/SelectableList'

export default observer(function SourcesAppIndex(props: AppProps<AppType.sources>) {
  const { activeSources, allSources } = props.sourcesStore
  const results = [
    ...activeSources.map(app => ({
      // only apply the click events to the active sources...
      ...props.itemProps,
      id: app.source.id,
      title: (
        <>
          {app.appName}&nbsp;·&nbsp;
          <Text fontWeight={300} alpha={0.7}>
            {app.display.name}
          </Text>
        </>
      ),
      subtitle: <OrbitAppInfo sourceId={app.source.id} app={app} />,
      icon: app.integration,
      total: activeSources.length,
      appConfig: sourceToAppConfig(app),
      group: 'Sources',
    })),
    ...allSources.map((app, index) => ({
      // ...these have their own onClick
      id: `${app.integration}${index}`,
      title: app.appName,
      icon: app.integration,
      onClick: !app.views.setup && addSourceClickHandler(app),
      disableSelect: !app.views.setup,
      after: app.views.setup ? null : (
        <View marginTop={4}>
          <Icon size={12} opacity={0.5} name="uilink6" />
        </View>
      ),
      appConfig: app.views.setup
        ? {
            ...sourceToAppConfig(app, { target: 'source' }),
            viewType: 'setup',
          }
        : null,
      group: 'Add source',
    })),
  ]

  return <SelectableList items={results} onSelect={props.onSelectItem} onOpen={props.onOpenItem} />
})
