import {
  Header,
  Footer,
  Border,
  SectionFeatureNewsSearch,
  SearchIllustration,
  SectionFeatureIntelligence,
} from './HomePage'
import * as React from 'react'
import { view } from '@mcro/black'
import { Section, SectionContent } from '~/views/section'
import { Title, P, LeftSide, SmallTitle, RightSide } from '~/views'
import * as Constants from '~/constants'
import Media from 'react-media'

@view
class FeaturesIntro {
  render() {
    return (
      <Section>
        <SectionContent halfscreen>
          <Media query={Constants.screen.large}>
            {isLarge => (
              <LeftSide css={{ textAlign: 'left' }}>
                <section css={{ justifyContent: 'center', height: '100%' }}>
                  <SmallTitle>Features</SmallTitle>
                  <Title italic size={4} margin={[0, 0, 20, -5]}>
                    Personalized news and smart search work to unify the cloud.
                  </Title>
                  <line
                    if={false}
                    css={{
                      margin: [26, 40],
                      width: '75%',
                      height: 4,
                      background: '#ddd',
                      opacity: 0.15,
                    }}
                  />
                  <P
                    size={isLarge ? 1.9 : 1.5}
                    alpha={0.75}
                    margin={[0, '27%', 15, 0]}
                    css={{
                      lineHeight: '36px',
                    }}
                  >
                    Upgrade your Mac's intelligence with a unified work
                    operating system.
                  </P>
                </section>
              </LeftSide>
            )}
          </Media>
        </SectionContent>
      </Section>
    )
  }
}

@view
export default class FeaturesPage {
  render() {
    return (
      <React.Fragment>
        <Header />
        <FeaturesIntro />
        <surround css={{ position: 'relative' }}>
          <Border css={{ top: 0, zIndex: 1 }} />
          <SectionFeatureNewsSearch />
          <SearchIllustration />
          <SectionFeatureIntelligence />
        </surround>
        <Footer />
      </React.Fragment>
    )
  }
}
