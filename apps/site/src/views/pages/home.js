import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => (
  <UI.Text
    size={1.45}
    lineHeight="1.9rem"
    marginBottom={20}
    color={[0, 0, 0, 0.5]}
    {...props}
  />
)

const SubText = props => <Text size={1.2} lineHeight="1.65rem" {...props} />
const Hl = props => <UI.Text display="inline" {...props} />

const Title = props => <Text fontWeight={800} color="#000" {...props} />
const SubTitle = props => (
  <UI.Title fontWeight={800} marginBottom={30} {...props} />
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
            We're a Founders Fund startup working on an all-in-one{' '}
            <Hl>internal company visibility</Hl> app.
          </Text>

          <hr />

          <SubText>
            We were inspired by tooling that high tech companies use to unify
            their cloud tools and knowledge. Companies like Stripe & Facebook
            build tools that improve their internal visibility with easy search
            and feeds for any team.
          </SubText>

          <Text>Our goal: to make your intranet better than theirs.</Text>
          <img $screen src="/screenshot.png" />
        </section>
        <section $bordered>
          <SubTitle>How?</SubTitle>

          <ul $mainList>
            <li>
              <Title>See &nbsp;&nbsp;👀</Title>
            </li>

            <Text>
              Which are our company's big projects?
              <br />How are they doing?
              <br />What's happening on team X?
              <br />What was that document Lisa was working on?
              <br />What was the slack discussion about issue #244?
            </Text>

            <SubText>
              Whether or not you expose it, these questions are being asked
              every day within your company. Orbit makes them clear to everyone
              and lets you choose which to display.
            </SubText>

            <break />

            <li>
              <Title>Control &nbsp;&nbsp;🚀</Title>
            </li>

            <Text>
              Orbit is a tool made for <em>your company</em>, not ours. So it
              should work like you do. That's why we give you all the control
              you need:
            </Text>

            <ul $subList>
              <li>
                <SubText>Pin important docs to any search.</SubText>
              </li>
              <li>
                <SubText>
                  Customize a feed of everything you care about.
                </SubText>
              </li>
              <li>
                <SubText>Display your KPIs to the rest of the org.</SubText>
              </li>
            </ul>

            <break />

            <li>
              <Title>Secure &nbsp;&nbsp;🔒</Title>
            </li>

            <Text>
              You don't want to trust a company with all your internal data.
              Neither would we.
            </Text>

            <SubText>
              That's why we designed Orbit to be completely offline. It follows
              the <Hl>Secure Offline IEE2014 Spec</Hl>. Your data never leaves
              your computer, we never touch any of your data or any of your
              keys, and Orbit respects all your internal permissions.
            </SubText>
          </ul>
        </section>

        <section $bordered>
          <SubTitle>When?</SubTitle>

          <Title>Orbit launches in beta in 2 months</Title>

          <Text>
            Until then, let us know you're interested and give us some
            information on the tools you use today, so we can gather some data
            on how Orbit could make your workday better.
          </Text>

          <UI.Form>
            <UI.Field size={1.2} label="Name" />
            <UI.Field size={1.2} label="Email" />
            <UI.Field
              size={1.2}
              label="What you use"
              type="textarea"
              elementProps={{
                rows: 10,
                css: { borderColor: 'red', width: '100%' },
              }}
            />
            <br />
            <UI.Button size={1.5}>Send 👋</UI.Button>
          </UI.Form>
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
    hr: {
      display: 'flex',
      height: 0,
      border: 'none',
      borderTop: [1, [0, 0, 0, 0.05]],
      margin: [20, 0],
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
