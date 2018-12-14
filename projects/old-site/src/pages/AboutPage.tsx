import { Header, Footer, PostTemplate } from '../components'
import { P2, Section, SubTitle } from '../views'
import { SectionContent } from '../views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '../constants'
import { Bauhaus } from '../views/Bauhaus'

@view
export class AboutPage extends React.Component {
  render() {
    return (
      <div
        style={{
          overflow: 'hidden',
          flex: 1,
          background: Constants.blueTheme.background,
        }}
      >
        <UI.Theme theme={Constants.blueTheme}>
          <Header />
          <Section>
            <SectionContent padded>
              <Bauhaus
                showCircle
                opacity={0.1}
                circleColor="#F7C7FF"
                transform={{ scale: 0.8, y: '-45%', x: '65%' }}
                zIndex={0}
              />
              <Bauhaus
                showCircle
                opacity={0.1}
                transform={{ scale: 0.57, y: '191%', x: '84%' }}
                zIndex={0}
              />
              <Bauhaus
                showTriangle
                showSquare
                opacity={0.05}
                transform={{ scale: 1, y: '25%', x: '-34%' }}
                zIndex={0}
              />
              <PostTemplate
                sectionTitle="About Us"
                title="Passionate about making our tools more intelligent and intuitive."
                paragraphs={
                  <UI.PassProps>
                    <P2>
                      Your team is growing and so are its organizational problems. Work chat is
                      noisy. What's going on across the company? Discovery just doesn't work with
                      modern services. Intranet systems want to solve important problems, but remain
                      outdated.
                    </P2>
                    <P2>
                      Orbit takes a new approach. Here's three things we learned in building a
                      modern knowledge management system.
                    </P2>
                    <P2>
                      <strong>It has to be on device.</strong>
                      <br />
                      You don't want a cloud service to be managing <em>all your sensitive data</em>
                      . On device is a no-risk, no-hassle solution with the easiest possible
                      onboarding: just download an app. Your sensitive data absolutely never leaves
                      your company firewall.
                    </P2>
                    <P2>
                      <strong>It can't add yet another source of truth.</strong>
                      <br />
                      Is a stale wiki a universal constant, or can we do better? Whether you use a
                      wiki or not, Orbit makes your knowledge much more useful. Unifying all your
                      services with smart sorting means people can trust answers from it to be the
                      most recent available: whether from a Slack conversation, document, ticket, or
                      knowledgebase.
                    </P2>
                    <P2>
                      <strong>It has to be a pleasant part of your day.</strong>
                      <br />
                      In order to be useful Orbit has to be a place people want to check in with. It
                      has to work with the tools you already have, be always at hand on your
                      desktop, and never get in the way. Design is of the highest importance.
                    </P2>
                    <SubTitle>A unique approach</SubTitle>
                    <P2>
                      Orbit aims to reinvent the way companies operate by giving them an on device
                      brain. It's a beautiful intranet system for today, without any infrastructure
                      necessary. We're rethinking knowledge management from the ground up and we're
                      excited to share it with the world.
                    </P2>
                    <P2>
                      Signup for early access, and{' '}
                      <a href="mailto:natewienert@gmail.com">let us know what you think</a>.
                    </P2>
                  </UI.PassProps>
                }
              />
            </SectionContent>
          </Section>
          <Footer noMission />
        </UI.Theme>
      </div>
    )
  }
}
