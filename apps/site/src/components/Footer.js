import * as React from 'react'
import { view } from '@mcro/black'
import {
  Section,
  SectionContent,
  SmallTitle,
  P2,
  RightSide,
  Callout,
} from '~/views'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'

@view
export class Footer {
  render({ noMission }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section>
            <SectionContent
              padded
              css={isLarge ? { padding: [150, 0] } : { padding: [40, 20] }}
            >
              <left
                css={
                  isLarge
                    ? { width: '50%', padding: [0, 20] }
                    : { padding: [0, 0, 50] }
                }
              >
                <Callout if={!noMission}>
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
                </Callout>
              </left>
              <RightSide noEdge>
                <div css={{ flexFlow: 'row' }}>
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
}
