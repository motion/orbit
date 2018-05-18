import { Header, Footer, Join } from '~/components'
import {
  Title,
  P,
  Callout,
  HalfSection,
  Border,
  Section,
  SectionContent,
} from '~/views'
import * as React from 'react'
import { view } from '@mcro/black'
import * as Constants from '~/constants'
import Media from 'react-media'

@view
class AboutIntro {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent padded halfscreen>
              <HalfSection css={{ paddingRight: '10%' }}>
                <Title italic size={2.8} margin={[0, 0, 10, 0]}>
                  Focused on making operating systems more intelligently in tune
                  with how we work.
                </Title>
              </HalfSection>
              <HalfSection>
                <Callout css={isLarge && { margin: [0, 0, 0, 'auto'] }}>
                  <Join />
                </Callout>
              </HalfSection>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
export default class FeaturesPage {
  render() {
    return (
      <React.Fragment>
        <Header />
        <AboutIntro />
        <Section>
          <Border css={{ top: 0 }} />
          <Border css={{ bottom: -4 }} />
          <SectionContent padded>
            <inner css={{ padding: [0, '10%'] }}>
              <P size={2.4} css={{ lineHeight: '44px' }} alpha={0.75}>
                Orbit runs intimately in your everyday. That means it has to
                work for you, the individual.
                <br />
                <br />
                Our goal is to build a more intuitive OS. To do that we need
                trust. Privacy, security, and user experience our first
              </P>
            </inner>
          </SectionContent>
        </Section>
        <Footer noMission />
      </React.Fragment>
    )
  }
}
