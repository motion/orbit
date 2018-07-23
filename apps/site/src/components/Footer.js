import * as React from 'react'
import { view } from '@mcro/black'
import { SectionContent } from '~/views/sectionContent'
import { Title, P, Link } from '~/views'
import { BrandLogo, Join } from '~/components'
import * as Constants from '~/constants'
import * as UI from '@mcro/ui'

const SmallTitle = props => (
  <P
    size={1.1}
    alpha={1}
    color="#111"
    style={{ textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}
    titleFont
    {...props}
  />
)

const Bottom = view({
  overflow: 'hidden',
  zIndex: 1000,
})

const Nav = view({
  flex: 1,
  height: '100%',
})

// Link
const FootLink = view(Link, {
  margin: [0, 0, 5],
  color: [0, 0, 0, 0.5],
})

const Sections = view({
  flex: 1,
  flexFlow: 'row',
  [Constants.screen.smallQuery]: {
    flexFlow: 'column',
  },
})

const StartSection = view({
  maxWidth: '50%',
  flex: 1,
  [Constants.screen.smallQuery]: {
    padding: [0, 0, 50],
    textAlign: 'center',
    order: 2,
    margin: [50, 'auto', 0],
    alignItems: 'center',
  },
})

const EndSections = view({
  flex: 2,
  flexFlow: 'row',
  padding: [0, 0, 0, 40],
  alignItems: 'space-around',
  [Constants.screen.smallQuery]: {
    flexFlow: 'column',
  },
})

const Section = view({
  margin: [0, '10%'],
  [Constants.screen.smallQuery]: {
    margin: [0, -40, 40],
  },
})

const Contact = view('a', {
  [Constants.screen.smallQuery]: {
    margin: 'auto',
  },
})

// @attachTheme
@view
export class Footer extends React.Component {
  render() {
    const { theme, noCallToAction } = this.props
    return (
      <Bottom css={{ background: '#fff', flex: 1 }}>
        <SectionContent css={{ flex: 1 }}>
          <UI.View
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
            <UI.View css={{ margin: [40, 40], transform: { scale: 1.2 } }}>
              <Join size={2} />
            </UI.View>
          </UI.View>
          <UI.View css={{ padding: [50, 0, 100, 0] }}>
            <Sections>
              <StartSection if={!noCallToAction}>
                <BrandLogo />
                <br />
                <Contact
                  style={{
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                  href="mailto:natewienert@gmail.com"
                >
                  Get in touch
                </Contact>
                <br />
                <br />
                <br />
                <small style={{ opacity: 0.5 }}>
                  © Orbit 2018, all rights reserved.
                </small>
              </StartSection>
              <EndSections>
                <Section>
                  <SmallTitle>Company</SmallTitle>
                  <Nav>
                    <FootLink if={false} to="/features">
                      Features
                    </FootLink>
                    <FootLink if={false} to="/use-cases">
                      Use Cases
                    </FootLink>
                    <FootLink to="/about">About Us</FootLink>
                  </Nav>
                </Section>
                <Section if={false}>
                  <SmallTitle>Follow</SmallTitle>
                  <Nav>
                    <FootLink if={false} to="/blog">
                      Blog
                    </FootLink>
                    <FootLink to="https://twitter.com/tryorbit">
                      Twitter
                    </FootLink>
                    <FootLink to="https://github.com/motion">Github</FootLink>
                  </Nav>
                </Section>
                <Section>
                  <SmallTitle>More</SmallTitle>
                  <Nav>
                    <FootLink to="/privacy">Privacy Policy</FootLink>
                    <FootLink to="/terms">Terms of Use</FootLink>
                  </Nav>
                </Section>
              </EndSections>
            </Sections>
          </UI.View>
        </SectionContent>
      </Bottom>
    )
  }
}
