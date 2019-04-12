import { FullScreen, gloss, SpaceGroup, Title, View } from '@o/ui'
import React from 'react'
import orbitsbg from '../../../public/images/orbits-bg.jpg'
import orbits from '../../../public/images/orbits.svg'
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
          <Title>hello world</Title>
        </View>
      </Page.Content>

      <Page.Background background={theme => theme.background} />

      <Page.Parallax overflow="hidden" speed={0.1} zIndex={-3}>
        <FullScreen
          className="orbits-bg"
          opacity={0.15}
          backgroundImage={`url(${orbitsbg})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        />
        <Spotlight />
      </Page.Parallax>

      <Page.Parallax overflow="hidden" speed={0.2} zIndex={-2}>
        <FullScreen
          className="orbits-bg"
          backgroundImage={`url(${orbits})`}
          backgroundPosition="top center"
          backgroundRepeat="no-repeat"
          // animation="rotate linear 100s infinite"
          // transformOrigin="center center"
        />
        <FadeDown />
      </Page.Parallax>
    </Page>
  )
}

const FadeDown = gloss(FullScreen).theme((_, theme) => ({
  background: `linear-gradient(transparent, ${theme.background})`,
}))
