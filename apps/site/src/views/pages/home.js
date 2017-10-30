import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => (
  <UI.Text size={1.5} marginBottom={20} color={[0, 0, 0, 0.75]} {...props} />
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
        <ora
          css={{
            background: [0, 0, 0, 0.29],
            backdropFilter: 'blur(10px)',
            position: 'fixed',
            top: 20,
            right: 20,
            color: '#fff',
            zIndex: 10000000,
            width: 280,
            borderRadius: 10,
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
          }}
        >
          <header css={{ padding: 10 }}>
            <UI.Icon name="zoom" />
          </header>
          <content css={{ padding: 20 }}>
            lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum
            dolor lorem ipsum dolor
          </content>
        </ora>

        <section
          css={{ background: '#f2f2f2', height: window.innerHeight - 20 }}
        >
          <header $$row css={{ background: '#ddd', zIndex: 10000 }}>
            <sectionContent>
              <thing $$row css={{ alignItems: 'center', padding: [10, 0] }}>
                <img css={{ height: 50, marginRight: 10 }} src="/icon2.png" />
                <img css={{ height: 30, fill: '#fff' }} src="/wordmark.svg" />
              </thing>
            </sectionContent>
          </header>

          <sectionContent
            $padded
            css={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <content>
              <Title size={4}>
                A new class of app,<br /> for the modern team.
              </Title>

              <Text size={2.2}>
                A smart assistant that is always there<br />
                with answers based on everything you use.<br />
                <span css={{ background: 'yellow' }}>
                  Put your company knowledge to work.
                </span>
                <br />
              </Text>

              <hr />

              <img
                css={{
                  position: 'absolute',
                  top: -200,
                  right: -200,
                  opacity: 0.2,
                  filter: 'grayscale(100%)',
                  transform: {
                    scale: 0.5,
                  },
                }}
                src="/orbitals.svg"
              />

              <narrow if={false}>
                <Text textAlign="center" size={2.2}>
                  Search across every service and see an activity feed for any
                  project or team.
                </Text>
              </narrow>

              <logos
                css={{
                  flexFlow: 'row',
                  flex: 1,
                  justifyContent: 'space-around',
                  margin: [20, 0, 40],
                }}
              >
                <UI.PassProps size={40}>
                  <UI.Icon name="social-slack" />
                  <UI.Icon name="social-github" />
                  <UI.Icon name="social-google" />
                  <UI.Icon name="social-dropbox" />
                  <UI.Icon name="social-trello" />
                  <UI.Icon name="social-slack" />
                  <UI.Icon name="social-github" />
                  <UI.Icon name="social-google" />
                  <UI.Icon name="social-dropbox" />
                  <UI.Icon name="social-trello" />
                </UI.PassProps>
              </logos>

              <hr />

              <tooltip
                css={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <inner
                  css={{
                    background: '#fff',
                    borderRadius: 10,
                    padding: [10, 20],
                    marginBottom: -20,
                  }}
                >
                  <Text size={1.1} textAlign="center">
                    Orbit is an ambitious new application,<br />
                    and we're doing things a bit differently.<br />
                    Read on to learn how.
                  </Text>
                </inner>
              </tooltip>
            </content>
          </sectionContent>
        </section>

        <section $bordered>
          <ul $mainList>
            <li>
              <Title $liTitle>Search</Title>
            </li>

            <ul $subList>
              <li>
                <Text>Smart search across every service.</Text>
              </li>
              <li>
                <Text>Pin what's important.</Text>
              </li>
              <li>
                <Text>Stale files fade away.</Text>
              </li>
            </ul>

            <break />

            <li>
              <Title $liTitle>See</Title>
            </li>

            <ul $subList>
              <li>
                <Text>Whats happening on that project?</Text>
              </li>
              <li>
                <Text>What's happening on team X?</Text>
              </li>
              <li>
                <Text>Where's that document Lisa was editing?</Text>
              </li>
              <li>
                <Text>What was the slack discussion about #244?</Text>
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
      flex: 1,
    },
    sectionContent: {
      width: '85%',
      minWidth: 300,
      maxWidth: 800,
      margin: [0, 'auto'],
    },
    padded: {
      padding: [45, 0],
    },
    narrow: {
      maxWidth: 500,
      alignSelf: 'center',
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
      marginBottom: 0,
    },
    mainList: {
      padding: [0, 20],

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
