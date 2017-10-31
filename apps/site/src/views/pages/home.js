import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Icon, Logo, Text, Title, Hl, SubText } from './views'
import { throttle } from 'lodash'
import Observer from '@researchgate/react-intersection-observer'

let blurredRef

const colorTeal = '#49ceac'
const colorBlue = '#133cca'

const allItems = {
  0: [
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'mail',
      date: Date.now() - 100000,
      category: 'Results',
    },
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'mail',
      date: Date.now() - 100000,
      category: 'Results',
    },
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'mail',
      date: Date.now() - 100000,
      category: 'Results',
    },
  ],
  1: [
    {
      primary: 'Some slack convo',
      secondary: 'lorem ipsum',
      icon: 'social-slack',
      date: Date.now() - 100000,
      category: 'Results',
    },
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'social-slack',
      date: Date.now() - 100000,
      category: 'Results',
    },
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'social-slack',
      date: Date.now() - 100000,
      category: 'Results',
    },
  ],
  2: [
    {
      primary: 'Document',
      secondary: 'lorem ipsum',
      icon: 'google',
      date: Date.now() - 100000,
      category: 'Results',
    },
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'google',
      date: Date.now() - 100000,
      category: 'Results',
    },
    {
      primary: 'test',
      secondary: 'lorem ipsum',
      icon: 'google',
      date: Date.now() - 100000,
      category: 'Results',
    },
  ],
}

@view
class Ora {
  render({ showIndex }) {
    const items = allItems[showIndex]
    if (window.innerWidth < 800) {
      return null
    }
    return (
      <UI.Theme name="dark">
        <ora
          css={{
            position: 'fixed',
            top: 20,
            right: 20,
            width: 280,
            height: 300,
            borderRadius: 10,
            background: [0, 0, 0, 0.65],
            color: '#fff',
            zIndex: 10000,
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
          }}
        >
          <header css={{ padding: 10 }}>
            <UI.Icon name="zoom" />
          </header>
          <content css={{ padding: 0 }}>
            <UI.List key={showIndex} groupKey="category" items={items} />
          </content>
        </ora>
      </UI.Theme>
    )
  }
}

@view
export default class HomePage extends React.Component {
  state = {
    lastIntersection: 0,
  }

  setRef = ref => {
    this.node = ref
    if (!ref) {
      return
    }
    if (this.props.blurred) {
      blurredRef = ref.childNodes[0]
    } else {
      this.on(
        this.node,
        'scroll',
        throttle(() => {
          blurredRef.style.transform = `translateY(-${this.node.scrollTop}px)`
        }, 16)
      )
    }
  }

  handleIntersect(index) {
    return ({ intersectionRatio }) => {
      console.log(index, 'intersectionRatio', intersectionRatio)
      this.setState({
        lastIntersection: index,
      })
    }
  }

  render({ blurred }) {
    function getStyle() {
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
          background: '#fff',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          // rounded:
          // polygon(5% 0, 95% 0, 100% 4%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)
          clip: `rect(${pad}px, ${right}px, ${bottom}px, ${left}px)`,
        },
      }
    }

    const styles = getStyle()

    return (
      <page css={styles.page} ref={this.setRef}>
        <Ora if={!blurred} showIndex={this.state.lastIntersection} />

        <contents>
          <section
            css={{
              background: colorTeal,
              height: window.innerHeight - 30,
              maxHeight: 880,
              minHeight: 700,
              position: 'relative',
            }}
          >
            <fadeDown
              css={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 500,
                background: 'linear-gradient(#f2f2f2, #fff)',
                zIndex: 1,
              }}
            />
            <orb
              css={{
                position: 'absolute',
                bottom: '-480%',
                right: '15%',
                borderRadius: 10000,
                width: 100,
                height: 100,
                background: '#f2f2f2',
                border: [1, 'dotted', '#eee'],
                transform: {
                  scale: 100,
                },
              }}
            />
            <orb
              css={{
                position: 'absolute',
                bottom: '-490%',
                right: '15%',
                borderRadius: 10000,
                width: 100,
                height: 100,
                opacity: 0.75,
                border: [1, 'dotted', '#eee'],
                transform: {
                  scale: 100,
                  rotate: '1.24deg',
                },
              }}
            />
            <orb
              css={{
                position: 'absolute',
                bottom: '-500%',
                right: '15%',
                borderRadius: 10000,
                width: 100,
                height: 100,
                border: [1, 'dotted', '#eee'],
                opacity: 0.5,
                transform: {
                  scale: 100,
                  rotate: '2.44deg',
                },
              }}
            />

            <bottomSlant
              css={{
                zIndex: 100,
                borderTop: [1, [0, 0, 0, 0.1]],
                bottom: -360,
              }}
            />
            <bottomSlant
              css={{
                zIndex: 100,
                borderTop: [1, [0, 0, 0, 0.1]],
                bottom: -365,
                opacity: 0.75,
              }}
            />
            <bottomSlant
              css={{
                zIndex: 100,
                borderTop: [1, [0, 0, 0, 0.1]],
                bottom: -370,
                opacity: 0.5,
              }}
            />
            <bottomSlant
              css={{
                zIndex: 100,
                borderTop: [1, [0, 0, 0, 0.1]],
                bottom: -375,
                opacity: 0.25,
              }}
            />

            <header $$row>
              <sectionContent>
                <thing
                  $$row
                  css={{
                    alignItems: 'center',
                    padding: [10, 0],
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                >
                  <Icon
                    fill={'#fff'}
                    css={{
                      height: 45,
                      margin: [-10, 10, -10, -30],
                    }}
                  />
                  <Logo css={{ height: 40 }} fill={'#fff'} />
                </thing>
              </sectionContent>
            </header>

            <Observer onChange={this.handleIntersect(0)} threshold={[0.5]}>
              <sectionContent
                $padded
                css={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <wrap>
                  <content $padRight>
                    <Title color={colorBlue} size={3.8}>
                      A smart assistant for your company.
                    </Title>

                    <Text size={2.2}>
                      Orbit is a simple, always on app that provides relevant
                      context as you work.<br />
                      <Hl>Scroll down and see how it works.</Hl>
                      <br />
                    </Text>

                    <hr />
                  </content>

                  <logos
                    css={{
                      flexFlow: 'row',
                      flex: 1,
                      justifyContent: 'space-around',
                      margin: [40, 0, 0],
                    }}
                  >
                    <UI.PassProps size={35} opacity={0.25}>
                      <UI.Icon name="social-slack" />
                      <UI.Icon name="social-github" />
                      <UI.Icon name="social-google" />
                      <UI.Icon name="social-dropbox" />
                      <UI.Icon name="social-trello" />
                      <UI.Icon name="mail" />
                      <UI.Icon name="calendar" />
                      <UI.Icon name="files_archive-paper" />
                      <UI.Icon name="files_book" />
                      <UI.Icon name="attach" />
                    </UI.PassProps>
                  </logos>
                </wrap>
              </sectionContent>
            </Observer>
          </section>

          <Observer onChange={this.handleIntersect(1)} threshold={[0.5]}>
            <section css={{ background: '#fff' }} $padded>
              <sectionContent $padRight $padBottom>
                <img
                  css={{
                    position: 'absolute',
                    top: -35,
                    right: -370,
                    transition: 'all ease-in 300ms',
                    animation: 'rotate 120s infinite linear',
                  }}
                  src="/orbitals.svg"
                />
                <Title color={colorBlue} size={3}>
                  Hands-free Intelligence
                </Title>
                <Text size={2} fontWeight={600} opacity={0.5}>
                  An assistant that's always there, not hidden in a tab or bot.
                </Text>
                <Text size={1.7}>
                  <ol $list>
                    <li>
                      Orbit hooks into <em>all</em> of your cloud services, and
                      privately into your email and chat.
                    </li>
                    <li>
                      Orbit uses machine learning to understand{' '}
                      <strong>when</strong> to show answers,{' '}
                      <strong>what's</strong> important to whom, and that{' '}
                      "accounting paperwork" is similar to "tax form".
                    </li>
                    <li>
                      Orbit is a desktop assistant that's always on. Wherever
                      you are - in chat, emails, your CRM, or just browsing the
                      web - it just works.
                    </li>
                  </ol>
                </Text>
              </sectionContent>
              <bottomSlant $dark />
            </section>
          </Observer>

          <UI.Theme name="dark">
            <Observer onChange={this.handleIntersect(2)} threshold={[0.5]}>
              <section $padded $dark>
                <bottomSlant css={{ background: '#fff' }} />
                <sectionContent $padRight $padBottom>
                  <after
                    css={{
                      position: 'absolute',
                      top: 0,
                      right: -200,
                      bottom: 0,
                      justifyContent: 'center',
                      opacity: 0.4,
                    }}
                  >
                    <UI.Icon color="#000" size={501} name="lock" />
                  </after>
                  <Title size={3}>The No-Cloud Infrastructure</Title>
                  <Text size={2} fontWeight={600} opacity={0.7}>
                    In order to work, Orbit needed to invent a new model: one
                    that keeps you safe.
                  </Text>
                  <SubText>
                    Here's the rub. To provide great context, Orbit needs to
                    hook into a lot of company data to be valuable. Your Slack,
                    email, documents, tasks, company knowledge.
                  </SubText>

                  <SubText>How can we do that completely securely?</SubText>

                  <SubText>
                    Answer: the data never once leaves your local computer. We
                    never see it, and neither does anyone else.
                  </SubText>
                  <SubText>
                    <Hl>
                      This allows us to be ambitious from day one without
                      compromise.
                    </Hl>{' '}
                    Orbit can crawl everything that's relevant to you and your
                    team without fear of data breaches, permissions exposures,
                    or the need to run a complicated on-prem installs.
                  </SubText>
                </sectionContent>
              </section>
            </Observer>
          </UI.Theme>

          <footer>
            <section css={{ padding: [250, 0] }} $$centered>
              <sectionContent>
                <Text size={3}>
                  Orbit is going into private beta in December.
                </Text>
                <Text size={2}>
                  <a href="mailto:natewienert@gmail.com">Send us an email</a> if
                  you're interested.
                </Text>
              </sectionContent>
            </section>
          </footer>
        </contents>
      </page>
    )
  }

  static theme = ({ blurred }) => {
    if (!blurred) {
      return {}
    }
    return {
      section: {
        filter: 'blur(25px)',
      },
    }
  }

  static style = {
    page: {},
    a: {
      color: '#5420a5',
      textDecoration: 'underline',
    },
    section: {
      marginLeft: -100,
      marginRight: -100,
      paddingLeft: 100,
      paddingRight: 100,
      position: 'relative',
      overflow: 'hidden',
    },
    sectionContent: {
      width: '85%',
      minWidth: 300,
      maxWidth: 800,
      margin: [0, 'auto'],
      position: 'relative',
      zIndex: 10,
    },
    padded: {
      padding: [110, 0],
    },
    padRight: {
      paddingRight: 300,
    },
    padBottom: {
      paddingBottom: 80,
    },
    dark: {
      background: colorBlue,
    },
    narrow: {
      maxWidth: 500,
      alignSelf: 'center',
    },
    topSlant: {
      position: 'absolute',
      top: -320,
      left: -500,
      right: -500,
      height: 400,
      zIndex: 0,
      transform: {
        rotate: '-1.5deg',
      },
    },
    bottomSlant: {
      position: 'absolute',
      bottom: -350,
      left: -500,
      right: -500,
      height: 400,
      zIndex: 0,
      transform: {
        rotate: '-1deg',
      },
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
    list: {
      '& > li': {
        listStylePosition: 'auto',
        listStyleType: 'decimal',
        margin: [0, 0, 15, 30],
      },
    },
    hr: {
      display: 'flex',
      height: 0,
      border: 'none',
      borderTop: [1, [0, 0, 0, 0.05]],
      paddingBottom: 20,
      marginTop: 20,
    },
    strong: {
      fontWeight: 500,
    },
    break: {
      height: 30,
    },
    footer: {
      height: 150,
    },
    starry: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
      backgroundImage: `url(/4-point-stars.svg)`,
      backgroundSize: '1%',
    },
  }
}
