import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => (
  <UI.Text
    size={1.5}
    lineHeight="1.9rem"
    marginBottom={20}
    color={[0, 0, 0, 0.75]}
    {...props}
  />
)

const SubText = props => <Text size={1.25} lineHeight="1.7rem" {...props} />
const Hl = props => <UI.Text display="inline" {...props} />

const Title = props => <Text fontWeight={800} color="#000" {...props} />
const SubTitle = props => (
  <UI.Title fontWeight={800} marginBottom={30} opacity={0.6} {...props} />
)

@view
export default class HomePage {
  render() {
    return (
      <page>
        <section>
          <Text size={2} marginBottom={30} textAlign="center">
            👋
          </Text>

          <Text textAlign="center">
            We're a Founders Fund company making an all-in-one{' '}
            <Hl>internal company visibility</Hl> app.
          </Text>

          <hr />

          <SubText>
            We were inspired by tooling that high tech companies use to unify
            their cloud tools and knowledge. Companies like Stripe & Facebook
            build tools that improve their internal visibility with easy search
            and feeds for any team.
          </SubText>

          <hr />

          <Text textAlign="center" color="#000">
            Our goal: to make your intranet better than theirs
          </Text>

          <img $screen src="/screenshot.png" />
        </section>
        <section $bordered>
          <SubTitle>How?</SubTitle>

          <ul $mainList>
            <li>
              <Title $liTitle>See</Title>
            </li>

            <ul $subList>
              <li>
                <Text>Whats happening on that big project?</Text>
              </li>
              <li>
                <Text>Who is working on it?</Text>
              </li>
              <li>
                <Text>What are the important documents for X?</Text>
              </li>
              <li>
                <Text>What's happening on team X?</Text>
              </li>

              <li>
                <Text>Where's that document Lisa was editing?</Text>
              </li>
              <li>
                <Text>Didn't we have a slack discussion about issue #244?</Text>
              </li>
            </ul>

            <break />

            <SubText>
              Whether or not you expose it, these questions are important in
              your company. Orbit makes them clear to everyone and lets you
              choose which to display.
            </SubText>

            <break />

            <li>
              <Title $liTitle>Control</Title>
            </li>

            <Text>
              Orbit is a tool made for <em>your company</em>, not ours. So it
              should work like you do.
            </Text>

            <ul $subList>
              <li>
                <SubText>Pin important docs to top any search.</SubText>
              </li>
              <li>
                <SubText>
                  Customize your feed to show what you care about.
                </SubText>
              </li>
              <li>
                <SubText>
                  Display your team KPIs to the rest of the org.
                </SubText>
              </li>
            </ul>

            <break />

            <li>
              <Title $liTitle>Secure</Title>
            </li>

            <Text>
              You don't want to trust a company with all your internal data.
              Neither would we.
            </Text>

            <SubText>
              Orbit never sends us your data. It follows the{' '}
              <Hl>Secure IEE2014 Spec</Hl>. We never touch the keys, and Orbit
              respects all your internal permissions.
            </SubText>
          </ul>
        </section>

        <section $bordered>
          <SubTitle>When?</SubTitle>

          <Title>Orbit beta is rolling out</Title>

          <Text>
            If you're interested, fill out our survey and we'll get in touch!
          </Text>

          <UI.Button
            theme="green"
            size={2}
            onClick={() => {
              window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLSdDbCj9OX_QqIz9JcOMNhjic8N6gfzWtYzVa3eP8bYaYsL3Pw/viewform',
                '_blank'
              )
            }}
          >
            🚀 Join the beta
          </UI.Button>
        </section>

        <footer />
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
      marginTop: 25,
      marginBottom: -25,
      zIndex: 1000,
      width: 2140 / 4,
      height: 1828 / 4,
    },
    liTitle: {
      marginLeft: 15,
    },
    mainList: {
      '& > li': {
        listStylePosition: 'inside',
        listStyleType: 'decimal-leading-zero',
        margin: [0, 0, 0, -40],
      },
    },
    subList: {
      '& > li': {
        listStylePosition: 'auto',
        listStyleType: 'decimal',
        margin: [0, 0, -15, 30],
      },
    },
    hr: {
      display: 'flex',
      height: 0,
      border: 'none',
      borderTop: [1, [0, 0, 0, 0.05]],
      margin: [15, 0],
      padding: [10, 0],
    },
    break: {
      height: 30,
    },
    footer: {
      height: 150,
    },
  }
}
