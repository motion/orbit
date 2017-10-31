import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Icon, Logo, Text, Title, Hl, SubText } from './views'
import { throttle } from 'lodash'
import Observer from '@researchgate/react-intersection-observer'

let blurredRef

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
            background: [0, 0, 0, 0.7],
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
              background: '#f2f2f2',
              height: window.innerHeight - 30,
              maxHeight: 880,
              minHeight: 700,
            }}
          >
            <header $$row css={{ background: '#fff', zIndex: 100 }}>
              <sectionContent>
                <thing $$row css={{ alignItems: 'center', padding: [10, 0] }}>
                  <Icon
                    fill="blue"
                    css={{
                      height: 40,
                      marginRight: 10,
                    }}
                  />
                  <Logo css={{ height: 30 }} fill="blue" />
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
                <content>
                  <Title size={4}>
                    A smart assistant<br /> for your knowledge.
                  </Title>

                  <Text size={2.2}>
                    A desktop assistant thats always on,<br />
                    bringing context to everything you do.<br />
                    <Hl>Your companys knowledge, unified.</Hl>
                    <br />
                  </Text>

                  <hr />

                  <narrow if={false}>
                    <Text textAlign="center" size={2.2}>
                      Search across every service and see an activity feed for
                      any project or team.
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
                      <UI.Icon name="mail" />
                      <UI.Icon name="calendar" />
                      <UI.Icon name="files_archive-paper" />
                      <UI.Icon name="files_book" />
                      <UI.Icon name="attach" />
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
                        Scroll down to see it in action
                      </Text>
                    </inner>
                  </tooltip>
                </content>
              </sectionContent>
            </Observer>
          </section>

          <Observer onChange={this.handleIntersect(1)} threshold={[0.5]}>
            <section $bordered $padded>
              <sectionContent $padRight>
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
                <Title size={3}>Look ma, no hands</Title>
                <Text size={2}>
                  Knowledge is 10x more useful when it's always there, not
                  hidden in a tab.
                </Text>
                <Text size={2}>
                  <Hl>Here's what makes Orbit special:</Hl>
                </Text>
                <Text size={1.6}>
                  <ol $list>
                    <li>
                      Orbit hooks into <em>all</em> of your cloud services, even
                      privately into your email and chat.
                    </li>
                    <li>
                      Orbit lives on your desktop. Wherever you are -- in chat,
                      emails, your CRM, or just browsing the web -- it just
                      works.
                    </li>
                    <li>
                      Machine learning means Orbit knows that "expense" also
                      means "charge".
                    </li>
                  </ol>
                </Text>
              </sectionContent>
            </section>
          </Observer>

          <UI.Theme name="dark">
            <Observer onChange={this.handleIntersect(2)} threshold={[0.5]}>
              <section $bordered $padded $dark>
                <sectionContent $padRight>
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
                  <Text size={2}>
                    In order to work, Orbit needed to invent a new model: one
                    that keeps your data safe.
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
                      This allows us to both be ambitious from day one without
                      creating a security nightmare.
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
            <section $padded $$centered>
              <Text>Orbit is going into private beta in December.</Text>
              <Text>
                <a href="mailto:natewienert@gmail.com">Send us an email</a> if
                you're interested.
              </Text>
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
        filter: 'blur(35px)',
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
    },
    sectionContent: {
      width: '85%',
      minWidth: 300,
      maxWidth: 800,
      margin: [0, 'auto'],
      position: 'relative',
    },
    padded: {
      padding: [110, 0],
    },
    padRight: {
      paddingRight: 300,
    },
    dark: {
      background: '#1a218c',
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
      margin: [15, 0],
      padding: [10, 0],
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
