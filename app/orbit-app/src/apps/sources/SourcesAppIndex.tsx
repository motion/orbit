import { sleep, useReaction } from '@mcro/black'
import { List, sourceToAppConfig, useActiveApps, useActiveSpace } from '@mcro/kit'
import { Icon, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { addSource } from '../../helpers/addSourceClickHandler'
import { AppProps } from '../AppTypes'

export default function SourcesAppIndex(_props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const activeApps = useActiveApps()

  // !TODO get a nice way to query active/inactive apps/sources
  const activeSources = []
  const allSources = []

  if (!activeSpace || !activeApps.length) {
    return null
  }

  // !TODO just started migrating this over...

  const results = useReaction(async () => {
    const getSourceItem = async app => ({
      id: `${app.source.id}`,
      title: app.display.name,
      subtitle: <OrbitSourceInfo sourceId={app.source.id} app={app} />,
      icon: app.source,
      iconBefore: true,
      total: activeSources.length,
      appConfig: await sourceToAppConfig(app),
      group: 'Sources',
    })

    const getInactiveSourceItem = async (source, index) => ({
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
            ...(await sourceToAppConfig(source)),
            type: 'sources',
            viewType: 'setup' as 'setup',
          }
        : {
            type: 'message',
            title: `Opening private authentication for ${source.name}...`,
          },
      group: 'Add source',
    })

    return [
      {
        title: 'Apps',
        icon: 'orbit-apps-full',
        iconBefore: true,
        iconSize: 12,
        appConfig: {
          type: 'sources',
          subType: 'manage-apps',
        },
      },
      ...(await Promise.all(activeSources.map(getSourceItem))),
      ...(await Promise.all(allSources.map(getInactiveSourceItem))),
    ]
  })

  return <List minSelected={0} items={results} />
}
