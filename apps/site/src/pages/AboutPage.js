import { Header, Footer } from '~/components'
import { Title, P2, Section, SubTitle, SmallTitle } from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const blueBg = UI.color('#F5FAF9')
const blueTheme = {
  background: blueBg,
  color: '#222',
  titleColor: blueBg.darken(0.75).desaturate(0.3),
  subTitleColor: blueBg.darken(0.7).desaturate(0.8),
}

@view
export class AboutPage extends React.Component {
  render() {
    return (
      <page $$flex $$background={blueTheme.background}>
        <UI.Theme theme={blueTheme}>
          <Header />
          <Section>
            <SectionContent padded>
              <header css={{ padding: [150, 150, 50], textAlign: 'center' }}>
                <SmallTitle>About Us</SmallTitle>
                <Title italic size={2.7} margin={[0, 0, 10, 0]}>
                  Passionate about making our tools more intelligent and
                  intuitive.
                </Title>
              </header>
              <card
                css={{
                  background: '#fff',
                  borderRadius: 6,
                  padding: ['7%', '10%'],
                  margin: [0, '10%', 50],
                  boxShadow: [[0, 3, 14, [0, 0, 0, 0.1]]],
                }}
              >
                <UI.PassProps
                  size={1.7}
                  sizeLineHeight={1.25}
                  alpha={0.8}
                  margin={[0, 0, 50]}
                >
                  <P2>
                    Your team is growing and so are its organizational problems.
                    Work chat is noisy. What's going on across the company?
                    Discovery just doesn't work with modern services. Intranet
                    systems want to solve important problems, but remain
                    outdated.
                  </P2>
                  <P2>
                    Orbit takes a new approach. Here's three things we learned
                    in building a modern knowledge management system.
                  </P2>
                  <P2>
                    <strong>It has to be on device.</strong>
                    <br />
                    You don't want a cloud service to be managing{' '}
                    <em>all your sensitive data</em>. On device is a no-risk,
                    no-hassle solution with the easiest possible onboarding:
                    just download an app. Your sensitive data absolutely never
                    leaves your company firewall.
                  </P2>
                  <P2>
                    <strong>It has to understand what you're doing.</strong>
                    <br />
                    You chat interally using one service, your support chats on
                    another one. Your team emails and works using any number of
                    clients and services. Orbit provides contextually relevant
                    answers wherever you work. With on-device private scanning
                    that knows what you're looking at anywhere on your OS and
                    shows inline information: from answers to questions, to
                    experts in your company.
                  </P2>
                  <P2>
                    <strong>It can't add yet another source of truth.</strong>
                    <br />
                    Is a stale wiki a universal constant, or can we do better?
                    Whether you use a wiki or not, Orbit helps your knowledge
                    stay up to date. Unifying all your services with smart
                    sorting means people can trust answers from it to be the
                    most recent available: whether from a Slack conversation,
                    document, ticket, or your knowledgebase.
                  </P2>
                  <SubTitle>A unique approach</SubTitle>
                  <P2>
                    Orbit aims to reinvent the way companies operate by giving
                    them an on device brain. It gives you a beautiful intranet
                    without infrastructure. We're rethinking knowledge
                    management from the ground up and we're excited to share it
                    with the world.
                  </P2>
                  <P2>
                    Signup for early access, and{' '}
                    <a href="mailto:natewienert@gmail.com">
                      let us know what you think
                    </a>.
                  </P2>
                </UI.PassProps>
              </card>
            </SectionContent>
          </Section>
          <Footer noMission />
        </UI.Theme>
      </page>
    )
  }
}
