import * as React from 'react'
import { AppProps } from '../AppProps'
import { addSourceClickHandler } from '../../helpers/addSourceClickHandler'
import { Button } from '@mcro/ui'
import { OrbitAppInfo } from '../../components/OrbitAppInfo'
import { observer, useComputed } from 'mobx-react-lite'
import { VirtualList } from '../../views/VirtualList/VirtualList'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import { useResults } from '../../hooks/useResults'

export const SourcesAppIndex = observer((props: AppProps<'sources'>) => {
  const { sourcesStore, isActive } = props

  const results = useComputed(() => {
    const { activeSources, allSources } = sourcesStore
    return [
      ...activeSources.map(app => ({
        id: app.source.id,
        title: app.appName,
        subtitle: app.display.name,
        icon: app.integration,
        total: activeSources.length,
        appConfig: sourceToAppConfig(app),
        children: <OrbitAppInfo app={app} />,
        group: 'Sources',
      })),
      ...allSources.map((app, index) => ({
        id: `${app.integration}${index}`,
        title: app.appName,
        icon: app.integration,
        onClick: addSourceClickHandler(app),
        after: <Button size={0.9}>Add</Button>,
        group: 'Add source',
      })),
    ]
  })

  console.log('results', results)
  useResults(results, !!isActive)

  return (
    <>
      <VirtualList items={results} itemProps={props.itemProps} />
    </>
  )
})
