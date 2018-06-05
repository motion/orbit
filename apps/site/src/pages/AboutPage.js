import { Header, Footer, PostTemplate } from '~/components'
import { P2, Section, SubTitle } from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view.ui
export class AboutPage extends React.Component {
  render() {
    return (
      <page $$flex $$background={Constants.blueTheme.background}>
        <UI.Theme theme={Constants.blueTheme}>
          <Header />
          <Section>
            <SectionContent padded>
              <PostTemplate
                sectionTitle="About Us"
                title="Passionate about making our tools more intelligent and intuitive."
                paragraphs={
                  <UI.PassProps>
                    <P2>
                      Your team is growing and so are its organizational
                      problems. Work chat is noisy. What's going on across the
                      company? Discovery just doesn't work with modern services.
                      Intranet systems want to solve important problems, but
                      remain outdated.
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
                      You chat internally using one service, your support chats
                      on another one. Your team emails and works using any
                      number of clients and services. Orbit provides
                      contextually relevant answers wherever you work. With
                      on-device private scanning that knows what you're looking
                      at anywhere on your OS and shows inline information: from
                      answers to questions, to experts in your company.
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
                      management from the ground up and we're excited to share
                      it with the world.
                    </P2>
                    <P2>
                      Signup for early access, and{' '}
                      <a href="mailto:natewienert@gmail.com">
                        let us know what you think
                      </a>.
                    </P2>
                  </UI.PassProps>
                }
              />
            </SectionContent>
          </Section>
          <Footer noMission />
        </UI.Theme>
      </page>
    )
  }
}
