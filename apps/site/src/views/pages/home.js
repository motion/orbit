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

const Title = props => (
  <Text fontWeight={800} color="#000" lineHeight="3.5rem" {...props} />
)
const SubTitle = props => (
  <UI.Title fontWeight={800} marginBottom={30} opacity={0.6} {...props} />
)

@view
export default class HomePage {
  render() {
    return (
      <page>
        <section>
          <Text if={false} size={2} marginBottom={30} textAlign="center">
            👋
          </Text>

          <Title textAlign="center" size={3}>
            Search everything.<br />See everything.
          </Title>

          <Title textAlign="center">An app for teams that get shit done.</Title>

          <img $screen src="/screenshot.png" />

          <br />
          <br />
          <br />

          <SubText textAlign="center">
            We were inspired by tools Stripe & Facebook built to power their
            company. It's instant search for everything + dynamic feeds on
            projects and teams.
          </SubText>

          <hr css={{ marginBottom: -70 }} />
        </section>
        <section $bordered>
          <ul $mainList>
            <li>
              <Title $liTitle>Search</Title>
            </li>

            <Text>
              It's pretty simple: find anything across any service. Pin
              important docs to the top of any search.
            </Text>

            <break />

            <li>
              <Title $liTitle>See</Title>
            </li>

            <Text>
              Beautiful feeds that show you exactly what you need to know to see
              what's happening with any team, project, and person.
            </Text>

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

            <li>
              <Title $liTitle>Secure</Title>
            </li>

            <Text>
              <strong>We never touch your company data.</strong>
            </Text>

            <Text>
              Not only that, we don't collect metadata, we never handle your
              keys, and your data never leaves your computer. We even use your
              existing credentials, so you only see what you should.
            </Text>
          </ul>
        </section>

        <section $bordered>
          <SubTitle>When?</SubTitle>

          <Text>If this sounds interesting, we'd love to hear from you:</Text>

          <break />

          <UI.Button
            theme="#7c50d2"
            size={2}
            onClick={() => {
              window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLSdDbCj9OX_QqIz9JcOMNhjic8N6gfzWtYzVa3eP8bYaYsL3Pw/viewform',
                '_blank'
              )
            }}
          >
            Beta survey
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
      width: 2054 / 3,
      height: 1762 / 3,
      alignSelf: 'center',
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
