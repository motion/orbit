import { useObserveOne } from '@mcro/model-bridge'
import { App, AppConfig, AppType, IntegrationType, SourceModel } from '@mcro/models'
import { Row, View } from '@mcro/ui'
import * as React from 'react'
import { useActiveApps } from '../../hooks/useActiveApps'
import { BorderLeft } from '../../views/Border'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import { AppIcon } from '../apps/AppsMainNew'
import { AppView } from '../AppView'

export const SourcesAppMain = (props: AppProps<any>) => {
  const source = useObserveOne(
    SourceModel,
    props.appConfig &&
      props.appConfig.viewType !== 'setup' && {
        where: { id: +props.appConfig.id },
      },
  )

  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  const type = props.appConfig.integration as IntegrationType
  const View = props.sourcesStore.getView(type, 'setting')

  if (!View) {
    return (
      <div>
        no view type {type}, for source <br />
        appConfig: <pre>{JSON.stringify(props.appConfig, null, 2)}</pre>
      </div>
    )
  }

  return <View source={source} appConfig={props.appConfig} />
}

export function appToAppConfig(app: App): AppConfig {
  return {
    id: `${app.id}`,
    title: app.name,
    type: AppType[app.type],
  }
}

const ManageApps = function ManageApps() {
  const apps = useActiveApps()
  const [index, setIndex] = React.useState(0)
  const selectedApp = apps[index]

  if (!selectedApp) {
    return null
  }

  return (
    <Row flex={1}>
      <View width="50%">
        <SelectableList
          createNewSelectionStore
          minSelected={0}
          items={apps.map(app => ({
            title: app.name,
            icon: <AppIcon app={app} />,
            type: app.type,
            iconBefore: true,
          }))}
          onSelect={setIndex}
        />
      </View>

      <View width="50%" position="relative">
        <BorderLeft />
        <AppView
          viewType="index"
          id="0"
          type={selectedApp.type}
          appConfig={appToAppConfig(selectedApp)}
        />
      </View>
    </Row>
  )
}
