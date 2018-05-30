import { Header, Footer, Join } from '~/components'
import { Title, P, Callout, HalfSection, Border, Section } from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'

const blueBg = UI.color('#FCFCFF')
const blueTheme = {
  background: blueBg,
  color: '#222',
  titleColor: blueBg.darken(0.75).desaturate(0.3),
  subTitleColor: blueBg.darken(0.7).desaturate(0.8),
}

@view
class AboutIntro extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent padded halfscreen>
              <HalfSection>
                <Title italic size={2.7} margin={[0, 0, 10, 0]}>
                  Passionate about making our tools more intelligent and
                  intuitive.
                </Title>
              </HalfSection>
              <HalfSection />
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
export class AboutPage extends React.Component {
  render() {
    return (
      <UI.Theme theme={blueTheme}>
        <Header />
        <AboutIntro />
        <Section>
          <Border css={{ top: 0 }} />
          <Border css={{ bottom: -4 }} />
          <SectionContent padded>
            <inner css={{ padding: [100, '20%'] }}>
              <P size={2} css={{ lineHeight: '44px' }} alpha={0.75}>
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
      </UI.Theme>
    )
  }
}
