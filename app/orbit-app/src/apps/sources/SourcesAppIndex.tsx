import * as React from 'react'
import { AppProps } from '../AppProps'
import { addSourceClickHandler } from '../../helpers/addSourceClickHandler'
import { Button } from '@mcro/ui'
import { observer, useComputed } from 'mobx-react-lite'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'
import { AppType } from '@mcro/models'
import SelectableList from '../../views/Lists/SelectableList'

export default observer(function SourcesAppIndex(props: AppProps<AppType.sources>) {
  const results = useComputed(() => {
    const { activeSources, allSources } = props.sourcesStore
    return [
      ...activeSources.map(app => ({
        // only apply the click events to the active sources...
        ...props.itemProps,
        id: app.source.id,
        title: `${app.appName} · ${app.display.name}`,
        subtitle: <OrbitAppInfo key={app.source.id} app={app} />,
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
        onClick: addSourceClickHandler(app),
        after: <Button size={0.9}>Add</Button>,
        group: 'Add source',
      })),
    ]
  })

  return <SelectableList items={results} />
})
