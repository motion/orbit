import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => <UI.Text size={1.5} marginBottom={20} {...props} />
const SubText = props => <Text size={1.25} lineHeight="1.7rem" {...props} />
const Hl = props => (
  <UI.Text display="inline" background="yellow" color="#111" {...props} />
)
const Title = props => <Text fontWeight={800} lineHeight="3.5rem" {...props} />
const SubTitle = props => (
  <UI.Title fontWeight={800} marginBottom={30} opacity={0.6} {...props} />
)

let blurredRef

@view
export default class HomePage extends React.Component {
  setRef = ref => {
    this.node = ref
    if (this.props.blurred) {
      blurredRef = ref.childNodes[0]
      console.log('br', blurredRef)
      return
    }
    if (this.node && !this.props.blurred) {
      this.on(this.node, 'scroll', () => {
        console.log(
          this.node.scrollTop,
          `translateY(-${this.node.scrollTop}px)`
        )
        blurredRef.style.transform = `translateY(-${this.node.scrollTop}px)`
      })
    }
  }

  render({ blurred }) {
    return (
      <page ref={this.setRef}>
        <ora
          if={!blurred}
          css={{
            background: [0, 0, 0, 0.29],
            backdropFilter: 'blur(10px)',
            position: 'fixed',
            top: 20,
            right: 20,
            color: '#fff',
            zIndex: 10000,
            width: 280,
            height: 300,
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

        <contents>
          <section
            css={{ background: '#f2f2f2', height: window.innerHeight - 20 }}
          >
            <header $$row css={{ background: '#ddd', zIndex: 100 }}>
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
                  Keep everyone<br /> on the same page.
                </Title>

                <Text size={2.2}>
                  A private assistant that is always on.<br />
                  With answers based on what you're doing.<br />
                  <Hl>Your company knowledge, put to work.</Hl>
                  <br />
                </Text>

                <hr />

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

          <UI.Theme name="dark">
            <section $bordered $padded $dark>
              <sectionContent $padRight>
                <Title size={3}>Unified Knowledge</Title>
                <Text size={2}>
                  Orbit makes your wiki work for you. In fact, it makes all your
                  tools for for you.
                </Text>
                <Text>
                  <ol>
                    <li>Orbit hooks into all your cloud services.</li>
                    <li>Orbit privately hooks into your email &amp; chat.</li>
                    <li>
                      Orbit builds a smart index of your company knowledge using
                      machine learning discovered in the last year.
                    </li>
                    <li>
                      Orbit provides you precise and relevant answers wherever
                      you are -- in chat, while writing emails, while browsing
                      the web -- thats right!
                    </li>
                  </ol>
                </Text>
              </sectionContent>
            </section>
          </UI.Theme>

          <section $bordered $padded>
            <sectionContent $padRight>
              <Title size={3}>The No-Cloud Infrastructure</Title>
              <Text size={2}>
                Orbit invents a new type of business tool: one that works for
                you.
              </Text>
              <Text>
                <Hl>This allows us to be ambitious & focus on user-value.</Hl>
              </Text>
              <Text>
                Because your data never once leaves your local computer (not
                ever going to our servers or anyone elses), Orbit can crawl
                everything that's relevant to you and your team without fear of
                data breaches, permissions exposures, or the need to run a
                complicated on-prem installs.
              </Text>
              <Text>Your security team won't even trip, man.</Text>
            </sectionContent>
          </section>

          <footer />
        </contents>
      </page>
    )
  }

  static style = {
    page: {},
    section: {
      position: 'relative',
    },
    sectionContent: {
      width: '85%',
      minWidth: 300,
      maxWidth: 800,
      margin: [0, 'auto'],
    },
    padded: {
      padding: [85, 0],
    },
    padRight: {
      paddingRight: 300,
    },
    dark: {
      background: '#111',
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
      zIndex: 100,
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

  static theme = ({ blurred }) => {
    if (!blurred) {
      return {
        page: {
          height: window.innerHeight,
          overflowY: 'scroll',
        },
      }
    }

    const pad = 20
    const width = 280
    const height = 300
    const bottom = height + pad
    const right = window.innerWidth - pad
    const left = window.innerWidth - width - pad

    return {
      page: {
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        clip: `rect(${pad}px, ${right}px, ${bottom}px, ${left}px)`,
      },
      section: {
        filter: 'blur(10px)',
      },
    }
  }
}
