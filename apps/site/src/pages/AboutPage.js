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
                  size={1.75}
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
                    It's not just a better user experience. On device solves two
                    things at once. First, it means your sensitive data never
                    leaves your company firewall. Second, it allows Orbit to be
                    dramatically more effective in dissemenation. More on that
                    later.
                  </P2>
                  <P2>
                    <strong>It can't add yet another source of truth.</strong>
                    <br />
                    There are two reasons why wiki and intranet systems are
                    places where knowledge goes stale. The obvious one is that
                    they require a lot of curation and time investment because
                    they add a new place to manage. But the other is that they
                    are never at hand and easy to use. This leads to shoulder
                    taps and ad-hoc knowledge never being codified.
                  </P2>
                  <P2>
                    <strong>It has to sort things out for you.</strong>
                    <br />
                    Once you've synced down data and set up knowledge, it
                    doesn't help if it doesn't get to you at the right time.
                    Orbit works contextually with a novel OCR system that
                    privately understands what you're doing. It puts relevant
                    knowledge in your hands exactly when it matters.
                  </P2>
                  <SubTitle>A unique approach</SubTitle>
                  <P2>
                    Orbit aims to reinvent intranet systems, solving the
                    problems they aim at but in ways that integrate with a
                    modern workplace. To do that, we rethought knowledge
                    management from the ground up.
                  </P2>
                  <P2>
                    We're excited to share it with the world. Signup below for
                    more information as we develop it, and early access once
                    it's ready.
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
