import * as React from 'react'
import { view } from '@mcro/black'
import SectionContent from '~/views/sectionContent'
import { Section, Link, Title, P } from '~/views'
import { BrandLogo, Join } from '~/components'
import * as Constants from '~/constants'
import * as UI from '@mcro/ui'

const SmallTitle = props => (
  <P
    size={1.1}
    alpha={1}
    color="#111"
    css={{ textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}
    titleFont
    {...props}
  />
)

@UI.injectTheme
@view
export class Footer extends React.Component {
  render({ theme, noCallToAction }) {
    return (
      <bottom css={{ background: theme.base.background, flex: 1 }}>
        <UI.Theme name="light">
          <SectionContent css={{ flex: 1 }}>
            <callToAction
              css={{
                flex: 2,
                textAlign: 'center',
                padding: [150, 0, 150 - 20],
                justifyContent: 'center',
              }}
            >
              <Title color="#AE2E73" size={3} css={{ marginBottom: 20 }}>
                Keep everyone in sync, without overhead.
              </Title>
              <div css={{ margin: [40, 40], transform: { scale: 1.2 } }}>
                <Join size={2} />
              </div>
            </callToAction>
            <footer css={{ padding: [50, 0, 100, 0] }}>
              <sections>
                <startSection if={!noCallToAction}>
                  <BrandLogo />
                  <br />
                  <a
                    $contact
                    css={{
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                    href="mailto:natewienert@gmail.com"
                  >
                    Get in touch
                  </a>
                  <br />
                  <br />
                  <br />
                  <small css={{ opacity: 0.5 }}>
                    © Orbit 2018, all rights reserved.
                  </small>
                </startSection>
                <endSections>
                  <section>
                    <SmallTitle>Company</SmallTitle>
                    <nav>
                      <Link $link to="/features">
                        Features
                      </Link>
                      <Link $link to="/use-cases">
                        Use Cases
                      </Link>
                      <Link $link to="/about">
                        About Us
                      </Link>
                    </nav>
                  </section>
                  <section>
                    <SmallTitle>Follow</SmallTitle>
                    <nav>
                      <Link $link to="/blog">
                        Blog
                      </Link>
                      <Link $link to="https://twitter.com/tryorbit">
                        Twitter
                      </Link>
                      <Link $link to="https://github.com/motion">
                        Github
                      </Link>
                    </nav>
                  </section>
                  <section>
                    <SmallTitle>More</SmallTitle>
                    <nav>
                      <Link $link to="/privacy">
                        Privacy Policy
                      </Link>
                      <Link $link to="/terms">
                        Terms of Use
                      </Link>
                    </nav>
                  </section>
                </endSections>
              </sections>
            </footer>
          </SectionContent>
        </UI.Theme>
      </bottom>
    )
  }

  static style = {
    bottom: {
      overflow: 'hidden',
      zIndex: 1000,
    },
    nav: {
      flex: 1,
      height: '100%',
    },
    link: {
      margin: [0, 0, 5],
      color: [0, 0, 0, 0.5],
    },
    sections: {
      flex: 1,
      flexFlow: 'row',
      [Constants.screen.smallQuery]: {
        flexFlow: 'column',
      },
    },
    startSection: {
      maxWidth: '50%',
      flex: 1,
      [Constants.screen.smallQuery]: {
        padding: [0, 0, 50],
        textAlign: 'center',
        order: 2,
        margin: [50, 'auto', 0],
        alignItems: 'center',
      },
    },
    endSections: {
      flex: 2,
      flexFlow: 'row',
      padding: [0, 0, 0, 40],
      alignItems: 'space-around',
      [Constants.screen.smallQuery]: {
        flexFlow: 'column',
      },
    },
    section: {
      margin: [0, '10%'],
      [Constants.screen.smallQuery]: {
        margin: [0, -40, 40],
      },
    },
    contact: {
      [Constants.screen.smallQuery]: {
        margin: 'auto',
      },
    },
  }
}
