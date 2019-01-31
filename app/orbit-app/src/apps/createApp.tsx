import { useTheme } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { Absolute, Button, Row, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useActiveApps } from '../hooks/useActiveApps'
import { useStoresSafe } from '../hooks/useStoresSafe'
import OrbitControls from '../pages/OrbitPage/OrbitControls'
import SelectableList from '../views/Lists/SelectableList'
import { AppProps } from './AppProps'
import AppsMainNew, { AppIcon } from './apps/AppsMainNew'
import { AppView } from './AppView'

function CreateAppIndex() {
  const apps = useActiveApps()
  return (
    <SelectableList
      minSelected={0}
      items={apps.map(app => ({
        title: app.name,
        icon: <AppIcon app={app} />,
        type: app.type,
        iconBefore: true,
      }))}
    />
  )
}

const CreateAppMain = observer(function CreateAppMain(props: AppProps<AppType.createApp>) {
  const { newAppStore } = useStoresSafe()
  const theme = useTheme()

  if (!props.appConfig) {
    return null
  }

  const { type } = props.appConfig

  useEffect(
    () => {
      newAppStore.setApp(type)
    },
    [type],
  )

  return (
    <Row flex={1}>
      <View width="50%">
        <AppsMainNew />
        <OrbitControls />
      </View>

      <View width="50%" position="relative" borderLeft={[1, theme.borderColor]}>
        <AppView viewType="index" id="0" type={type} appConfig={{ type }} />
      </View>

      <Absolute bottom={20} right={20}>
        <Theme name="selected">
          <Button iconAfter elevation={2} size={1.6} icon="check">
            Save
          </Button>
        </Theme>
      </Absolute>
    </Row>
  )
})

export const createApp = {
  index: CreateAppIndex,
  main: CreateAppMain,
}
