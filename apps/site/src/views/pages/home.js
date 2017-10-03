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

const SubText = props => <Text size={1.2} lineHeight="1.7rem" {...props} />
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

          <Text>
            We were inspired by tooling that high tech companies use to unify
            their cloud tools and knowledge.
          </Text>

          <Text>
            For example Stripe & Facebook both build an internal app thats
            improves internal visibility with easy search and feeds for any
            team.
          </Text>

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
                Security First
              </Text>
            </li>

            <SubText>
              Let's face it: you don't want to trust a company with all your
              internal data. Neither would we. That's why we designed Orbit to
              follow the <Hl>Secure Offline Infrastructure EE2014 Spec</Hl>.
            </SubText>

            <SubText>
              The cloud may be trendy, but security is cooler. Every piece of
              Orbit was designed to work fully offline, and without ever syncing
              either your keys or your data to our servers.
            </SubText>

            <SubText>
              That also comes with a few upsides: you can test it out easily on
              a per-individual level, without any extra setup, and without any
              specially priveleged account, all while keeping your privacy
              permissions in place.
            </SubText>

            <li>
              <Text fontWeight={800} color="#000">
                Exposing the Right Things
              </Text>
            </li>

            <SubText>
              A tool to help your company stay in sync needs to do one thing
              really well: expose whats happening.
            </SubText>

            <SubText>
              This is best explained through some of the features we've built:
            </SubText>

            <ul $subList>
              <li>
                <SubText>something else</SubText>
              </li>
              <li>
                <SubText>something else</SubText>
              </li>
              <li>
                <SubText>something else</SubText>
              </li>
            </ul>

            <li>
              <Text fontWeight={800} color="#000">
                The Rest
              </Text>
            </li>

            <SubText>
              Sure, we could go on about many cool features. But the proof is in
              how it helps your team day to day.
            </SubText>
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
        margin: [0, 0, 0, 20],
      },
    },
  }
}
