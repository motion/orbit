import * as React from 'react'
import { view } from '@mcro/black'
import { Title } from '../../../../views'
import { SubTitle } from '../../../../views/SubTitle'
import { HorizontalScrollRow } from '../../../../views/HorizontalScrollRow'
import { View, Text } from '@mcro/ui'

@view
export class OrbitSettingsTeam extends React.Component {
  render() {
    return (
      <>
        <SubTitle>Spaces</SubTitle>
        <HorizontalScrollRow>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} marginRight={10} alignItems="center">
              <View
                background="#222"
                borderRadius={100}
                width={32}
                height={32}
                alignItems="center"
                justifyContent="center"
              >
                <View border={[2, 'lightblue']} borderRadius={100} width={28} height={28} />
              </View>
              <SubTitle size={0.9}>Orbit</SubTitle>
            </View>
          ))}
        </HorizontalScrollRow>
        <Title>Orbit</Title>
        hello world
      </>
    )
  }
}
