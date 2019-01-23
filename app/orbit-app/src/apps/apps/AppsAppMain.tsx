import { View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { Title } from '../../views'
import { Center } from '../../views/Center'
import ListItem from '../../views/ListItems/ListItem'
import { AppProps } from '../AppProps'

export default function AppsAppMain(props: AppProps<any>) {
  const { appConfig } = props

  if (!appConfig) {
    return (
      <Center>
        <Title>no item selected {JSON.stringify(props.id)}</Title>
      </Center>
    )
  }

  const type = appConfig.type as any

  if (type === 'installed') {
    return <InstalledApps />
  }

  return <div>{JSON.stringify(appConfig)}</div>
}

const InstalledApps = observer(function InstalledApps() {
  const activeApps = useActiveAppsSorted()
  return (
    <View padding={20}>
      <Title>Installed apps</Title>
      {activeApps.map(app => (
        <ListItem key={app.id} title={app.name} />
      ))}
    </View>
  )
})
