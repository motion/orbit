import * as React from 'react'
import { view } from '@mcro/black'
import SectionContent from '~/views/sectionContent'
import { Section, RightSide, Link } from '~/views'
import { BrandLogo, Join } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'

@view
export class Footer extends React.Component {
  render() {
    return (
      <footer>
        <Media query={Constants.screen.large}>
          {isLarge => (
            <Section css={{ borderTop: [1, [255, 255, 255, 0.2]] }}>
              <SectionContent padded>
                <left
                  $$row
                  css={
                    isLarge
                      ? { width: '50%', paddingRight: '10%' }
                      : { padding: [0, 0, 50] }
                  }
                >
                  <UI.Theme name="light">
                    <Join />
                  </UI.Theme>
                </left>
                <RightSide noEdge>
                  <div
                    css={isLarge && { flex: 1, flexFlow: 'row', padding: 40 }}
                  >
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
      </footer>
    )
  }

  static style = {
    footer: {
      overflow: 'hidden',
      zIndex: 1000,
    },
    nav: {
      flex: 1,
      height: '100%',
    },
    link: {
      margin: [0, 0, 10],
    },
  }

  static theme = (_, theme) => {
    return {
      background: theme.base.background,
    }
  }
}
