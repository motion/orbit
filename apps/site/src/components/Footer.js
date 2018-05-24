import * as React from 'react'
import { view } from '@mcro/black'
import SectionContent from '~/views/sectionContent'
import { Section, SmallTitle, P2, RightSide, Callout, Link } from '~/views'
import { BrandLogo, Join } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'

@view
export class Footer {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent padded>
              <left
                $$row
                css={
                  isLarge
                    ? { width: '50%', padding: [0, 20] }
                    : { padding: [0, 0, 50] }
                }
              >
                <Join />
                <section if={false}>
                  <SmallTitle>Our Mission</SmallTitle>
                  <P2 size={1.6}>
                    Orbit runs intimately in your everyday. That means it has to
                    work for you, the individual.
                    <br />
                    <br />
                    Our goal is to build a more intuitive OS. To do that we need
                    trust. Privacy, security, and user experience our first
                    priorities.
                  </P2>
                </section>
              </left>
              <RightSide noEdge>
                <div css={isLarge && { flex: 1, flexFlow: 'row', padding: 40 }}>
                  <nav>
                    <Link $link to="/features">
                      {isLarge ? 'Features' : 'What'}
                    </Link>
                    <Link $link to="/use-cases">
                      {isLarge ? 'Use Cases' : 'Why'}
                    </Link>
                    <Link $link to="/about">
                      {isLarge ? 'About Us' : 'Who'}
                    </Link>
                  </nav>
                  <div $$flex />
                  <BrandLogo />
                </div>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }

  static style = {
    nav: {
      flex: 1,
      height: '100%',
    },
    link: {
      margin: [0, 0, 10],
    },
  }
}
