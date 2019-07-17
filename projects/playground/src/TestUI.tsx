import { Row, View } from '@o/ui'
import { createNavigator, SceneView, StackRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import * as React from 'react'

import { TestUIPopovers } from './TestUI/TestUIPopovers'

const Orbit = ({ descriptors, navigation }) => {
  const activeKey = navigation.state.routes[navigation.state.index].key
  const descriptor = descriptors[activeKey]
  return <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
}

const TestScreen = props => {
  return (
    <View flex={1} background="red">
      hihihihihi
      <button onClick={() => props.navigation.navigate('Test2')}>okok</button>
    </View>
  )
}

const TestScreen2 = props => {
  return (
    <View flex={1} background="green">
      hoooooooooooo
      <button onClick={() => props.navigation.navigate('Test')}>okok</button>
    </View>
  )
}

const navigator = createNavigator(
  Orbit,
  StackRouter({
    Test: {
      screen: TestScreen,
    },
    Test2: {
      screen: TestScreen2,
    },
  }),
  {},
)

const OrbitBrowser = createBrowserApp(navigator)

export function TestUI() {
  return (
    <Row flex={1} overflow="hidden" height="100%">
      <TestUIPopovers />
      <OrbitBrowser />
    </Row>
  )
}
