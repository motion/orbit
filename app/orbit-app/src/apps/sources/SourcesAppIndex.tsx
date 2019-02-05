import { sleep } from '@mcro/black'
import { AppType } from '@mcro/models'
import { Icon, Tab, Tabs, View } from '@mcro/ui'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitSourceInfo } from '../../components/OrbitSourceInfo'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { addSource } from '../../helpers/addSourceClickHandler'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { sourceToAppConfig } from '../../stores/SourcesStore'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'

export default observer(function SourcesAppIndex(props: AppProps<AppType.sources>) {
  const [activeSpace] = useActiveSpace()
  // const activeSpaceName = activeSpace ? activeSpace.name : ''
  const { activeSources, allSources } = props.sourcesStore
  const activeApps = useActiveApps()

  if (!activeSpace || !activeApps.length) {
    return null
  }

  const results = [
    {
      title: 'Manage Apps',
      subtitle: `${activeApps.map(x => x.name).join(', ')}`,
      icon: 'orbit-apps-full',
      iconBefore: true,
      iconSize: 12,
      appConfig: {
        subType: 'manage-apps',
      },
    },
    ...activeSources.map(app => ({
      // only apply the click events to the active sources...
      ...props.itemProps,
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

  return (
    <>
      <OrbitSettingsToolbar />
      <SelectableList minSelected={0} items={results} />
    </>
  )
})

const activePane = observable.box('0')

export const OrbitSettingsToolbar = observer(function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStoresSafe()
  const panes = [
    {
      key: '0',
      label: 'Current Space',
      paneType: 'app-sources',
      onClick: () => {
        paneManagerStore.setActivePaneByType('sources')
      },
    },
    {
      key: '1',
      label: 'Spaces',
      paneType: 'app-spaces',
      onClick: () => {
        paneManagerStore.setActivePaneByType('spaces')
      },
    },
    {
      key: '2',
      label: 'Settings',
      paneType: 'app-settings',
      onClick: () => {
        paneManagerStore.setActivePaneByType('settings')
      },
    },
  ]

  const onActive = React.useCallback(key => {
    if (typeof key === 'string') {
      panes.find(x => x.key === key).onClick()
      activePane.set(key)
    }
  }, [])

  return (
    <OrbitToolbar>
      <Tabs active={activePane.get()} height={30} onActive={onActive}>
        <Tab key="0" label="Current Space: " />
        <Tab key="1" label="Spaces" />
        <Tab key="2" label="Settings" />
      </Tabs>
    </OrbitToolbar>
  )
})
