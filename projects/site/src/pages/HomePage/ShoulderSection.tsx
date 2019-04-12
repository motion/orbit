import { FullScreen, SpaceGroup, Title, View } from '@o/ui'
import React from 'react'
import orbitsbg from '../../../public/images/orbits-bg.jpg'
import { Page } from '../../views/Page'
import { Spotlight } from '../../views/Spotlight'

export function ShoulderSection() {
  return (
    <Page offset={2}>
      <Page.Content>
        <View margin={['auto', 0]}>
          <SpaceGroup>
            <Title>hello world</Title>
          </SpaceGroup>
        </View>
      </Page.Content>

      <Page.Background background={theme => theme.background} />

      <Page.Parallax overflow="hidden" speed={0.1} zIndex={1}>
        <FullScreen
          className="orbits-bg"
          opacity={0.15}
          backgroundImage={`url(${orbitsbg})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="none"
        />
        <Spotlight />
      </Page.Parallax>
    </Page>
  )
}
