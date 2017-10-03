import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => (
  <UI.Text
    size={1.5}
    lineHeight="2rem"
    marginBottom={20}
    color={[0, 0, 0, 0.5]}
    {...props}
  />
)

const SubText = props => <Text size={1.2} lineHeight="1.65rem" {...props} />
const Hl = props => <UI.Text {...props} />

@view
export default class HomePage {
  render() {
    return (
      <page>
        <section>
          <Text>Hello,</Text>

          <Text>
            We're a Founders Fund startup working on an app to make {' '}
            <Hl>internal company visibility</Hl> amazing.
          </Text>

          <SubText>
            We were inspired by tooling that high tech companies use to unify
            their cloud tools and knowledge. Companies like Stripe & Facebook
            build tools that improve their internal visibility with easy search
            and feeds for any team.
          </SubText>

          <Text>Our goal: to democratize that & make it best in class.</Text>
          <img $screen src="/screenshot.png" />
        </section>
        <section $bordered>
          <UI.Title fontWeight={800} marginBottom={30}>
            How?
          </UI.Title>

          <ul $mainList>
            <li>
              <Text fontWeight={800} color="#000">
                Security First &nbsp;&nbsp;🔒
              </Text>
            </li>

            <Text>
              Let's face it: you don't want to trust a company with all your
              internal data. Neither would we.
            </Text>

            <SubText>
              That's why we designed Orbit to follow the{' '}
              <Hl>Secure Offline IEE2014 Spec</Hl>. Your data never leaves your
              company firewall and respects all your internal permissions.
            </SubText>

            <break />

            <li>
              <Text fontWeight={800} color="#000">
                Removing Invisibles &nbsp;&nbsp;👀
              </Text>
            </li>

            <Text>
              What's are our companies big projects? How are they doing? What's
              happening on team X this week? What was that document Lisa was
              working on? Who is in charge of new feature X?
            </Text>

            <SubText>
              Whether or not you expose it, these questions are being asked
              every day within your company. Orbit makes them clear to everyone.
            </SubText>

            <break />

            <li>
              <Text fontWeight={800} color="#000">
                Control &nbsp;&nbsp;🚀
              </Text>
            </li>

            <Text>
              Orbit is a tool made for <em>your company</em>, not ours. So it
              should work like you do. That's why we give you all the control
              you need:
            </Text>

            <ul $subList>
              <li>
                <SubText>
                  Control your internal search by pinning any results to the
                  top.
                </SubText>
              </li>
              <li>
                <SubText>
                  Choose which important documents and tickets to expose.
                </SubText>
              </li>
              <li>
                <SubText>Display your KPIs to the rest of the org.</SubText>
              </li>
            </ul>
          </ul>
        </section>

        <section $bordered>
          <UI.Title fontWeight={800} marginBottom={30}>
            When?
          </UI.Title>

          <Text fontWeight={800} color="#000">
            Soon
          </Text>

          <SubText>
            Let's face it: you don't want to trust a company with all your
            internal data. Neither would we. That's why we designed Orbit to
            follow the <Hl>Secure Offline Infrastructure EE2014 Spec</Hl>.
          </SubText>

          <UI.Form>
            <UI.Field label="email" />
            <UI.Button>Signup</UI.Button>
          </UI.Form>
        </section>
      </page>
    )
  }

  static style = {
    section: {
      width: '80%',
      minWidth: 300,
      maxWidth: 500,
      margin: [0, 'auto'],
      padding: [45, 0],
    },
    bordered: {
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    screen: {
      marginTop: 45,
      marginBottom: '-275%',
      width: 2140,
      height: 1828,
      transform: {
        scale: 0.25,
        x: '-150%',
        y: '-150%',
      },
    },
    mainList: {
      '& > li': {
        listStylePosition: 'inside',
        listStyleType: 'decimal-leading-zero',
        margin: [0, 0, 0, -25],
      },
    },
    subList: {
      '& > li': {
        listStylePosition: 'auto',
        listStyleType: 'decimal',
        margin: [0, 0, -15, 30],
      },
    },
    break: {
      height: 30,
    },
  }
}
