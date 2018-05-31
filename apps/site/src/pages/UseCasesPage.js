import { Header, Footer } from '~/components'
import {
  TopoBg,
  P,
  P2,
  LeftSide,
  Title,
  SubTitle,
  RightSide,
  Callout,
  FadedArea,
  Glow,
  Notification,
  HalfSection,
  Section,
  Slant,
} from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import * as Constants from '~/constants'
import Media from 'react-media'
import profileImg from '~/../public/screen-profile.png'
import chatImg from '~/../public/chat.svg'
import { scrollTo } from '~/helpers'

const altBg = UI.color('#F5F0E6')
const peachTheme = {
  background: altBg,
  color: altBg.darken(0.8).desaturate(0.1),
  titleColor: altBg.darken(0.55).desaturate(0.3),
  subTitleColor: altBg.darken(0.55).desaturate(0.8),
}

export const ChatIcon = props => (
  <img src={chatImg} width={`${120}px`} {...props} />
)

@view
class UseCasesIntro extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section
            css={{
              background: 'transparent',
              marginTop: -window.innerHeight / 2.2,
            }}
          >
            <SectionContent padded fullscreen>
              <Slant
                inverseSlant
                slantBackground={altBg.darken(0.05)}
                css={{ zIndex: 2 }}
              />
              <HalfSection css={{ position: 'absolute', bottom: 100 }}>
                <Title
                  color="#111"
                  italic
                  size={2.3}
                  margin={[0, '10%', 10, 0]}
                >
                  Company knowledge sorted and at hand.
                </Title>
                <P2 size={1.6} alpha={0.8}>
                  Everyone operates better when incoming is sorted and answers
                  are at hand.
                </P2>
                <P size={1.2} alpha={0.9} fontWeight={500}>
                  <a onClick={scrollTo('#customer-success')}>
                    Customer Success
                  </a>{' '}
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#reduce-interrupts')}>Team sync</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#remote-teams')}>Remote teams</a>
                </P>
              </HalfSection>
              <HalfSection />
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
class SectionUseCaseRemoteTeams extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: 'transparent' }} id="use-cases" inverse>
            <SectionContent
              id="remote-teams"
              fullscreen={isLarge}
              padded
              css={{ zIndex: 3 }}
            >
              <Glow
                style={{
                  background: altBg.lighten(0.015),
                  transform: { x: '-30%', y: '-15%' },
                }}
              />
              <Slant
                slantGradient={[Constants.useCasesSlantBg2, altBg]}
                css={{ zIndex: 2 }}
              />
              <LeftSide inverse>
                <SubTitle size={4.5} italic>
                  Remote<br />
                  teams
                </SubTitle>
                <div if={isLarge} css={{ height: '26%' }} />
                <section
                  css={{
                    textAlign: 'left',
                    display: 'block',
                    margin: isLarge ? [-40, 0, 0, '10%'] : 0,
                  }}
                >
                  <P alpha={0.6} size={2} margin={[0, 0, 10]}>
                    Beautiful unified profiles
                  </P>
                  <P2 size={1.6}>
                    Combined information from across the cloud in one place with
                    helpful information.
                  </P2>
                  <P2 size={1.6}>
                    See where people talk in Slack, what topics they care about,
                    and relevant recently edited files, tickets, and more.
                  </P2>
                  <br />
                </section>
                <Callout
                  css={
                    isLarge && {
                      width: '72%',
                      marginLeft: '35%',
                      textAlign: 'left',
                    }
                  }
                >
                  <P2 size={2} margin={0}>
                    Give your remote team a sense of unity and a place to
                    explore your company.
                  </P2>
                </Callout>
              </LeftSide>
              <RightSide css={{ bottom: 0 }}>
                <div $$flex css={{ marginTop: isLarge ? '21%' : 0 }} />
                <P2 if={false} size={1.8} css={{ margin: [5, 0, 10, 0] }}>
                  The smart way to sync
                </P2>
                <P
                  alpha={0.6}
                  size={2}
                  css={{ margin: [0, isLarge ? '12%' : 0, 10, 0] }}
                >
                  News is your team home
                </P>
                <P size={1.6} css={{ marginRight: isLarge ? '15%' : 0 }}>
                  It starts by learning company vocabulary. Then it learns what
                  you care about. The intersection of what you care about and
                  haven't seen, relative to your custom company's unique vocab
                  is shown.
                </P>
                <section
                  if={isLarge}
                  css={{
                    position: 'absolute',
                    top: '38%',
                    left: 50,
                    height: '35%',
                    width: 450,
                    overflow: 'hidden',
                  }}
                >
                  <FadedArea fadeBackground={altBg} fadeDown fadeRight>
                    <img
                      src={profileImg}
                      css={{
                        position: 'absolute',
                        width: 1199,
                        height: 'auto',
                        transformOrigin: 'top left',
                        transform: {
                          scale: 0.39,
                          x: 0,
                          y: 130,
                        },
                      }}
                    />
                  </FadedArea>
                </section>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
class SectionUseCaseCustomerSuccess extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section css={{ background: 'transparent' }} id="customer-success">
            <SectionContent fullscreen={isLarge} padded>
              <Glow
                style={{
                  background: altBg.lighten(0.025),
                  transform: { x: '40%', y: '-50%' },
                }}
              />
              <Slant
                slantGradient={[altBg.darken(0.05), Constants.useCasesSlantBg2]}
              />
              <chat>
                <ChatIcon />
              </chat>
              <LeftSide inverse>
                <div if={isLarge} css={{ height: '48%' }} />

                <section
                  css={{
                    textAlign: 'left',
                    display: 'block',
                    margin: isLarge ? [0, 0, 0, '12%'] : 0,
                  }}
                >
                  <P
                    if={isLarge}
                    alpha={0.6}
                    size={2}
                    css={{ margin: [0, 0, 10, 0] }}
                  >
                    Reduce onboarding time by 1/3
                  </P>
                  <P2 size={1.6} css={{ margin: isLarge ? [0, 0, 35, 0] : 0 }}>
                    Onboarding is an expensive process because it requires
                    multiple experienced people helping new employees. Orbit
                    puts knowledge they would normally never search or find at
                    their hands with automatic realtime contextual search.
                  </P2>
                </section>
                <Callout
                  if={isLarge}
                  css={{
                    width: '80%',
                    marginLeft: '25%',
                    textAlign: 'left',
                  }}
                >
                  <P2 size={2} margin={0}>
                    A smarter way to build your team knowledge.
                  </P2>
                </Callout>
              </LeftSide>
              <RightSide css={{ top: 0 }}>
                <div if={isLarge} $$flex css={{ marginTop: '5%' }} />
                <SubTitle size={4.5} italic>
                  Customer<br />Success
                </SubTitle>
                <div if={isLarge} $$flex css={{ marginTop: '10%' }} />
                <P
                  if={isLarge}
                  alpha={0.6}
                  size={2}
                  css={{ margin: [0, '15%', 10, 0] }}
                >
                  Your CSAT secret weapon
                </P>
                <P2 size={1.6} css={isLarge && { marginRight: '15%' }}>
                  Sales chat requires intimate knowledge of your product. Orbit
                  sits side by side with your success team as they chat on
                  Intercom or ZenDesk providing realtime answers from everything
                  happening at your company.
                </P2>
                <Callout
                  if={isLarge}
                  css={{ margin: [45, '10%', 40, 0], left: -30 }}
                >
                  <P2 size={2} margin={0}>
                    Organizational knowledge is now always at hand and useful.
                  </P2>
                </Callout>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }

  static style = {
    chat: {
      opacity: 0.1,
      filter: 'hue-rotate(40deg) grayscale(100%)',
      transform: { scale: 3 },
      position: 'absolute',
      zIndex: 0,
      left: '27%',
      top: '20%',
    },
  }
}

@view
class SectionUseCaseReduceInterrupts extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <Section inverse css={{ background: 'transparent' }}>
            <SectionContent
              id="reduce-interrupts"
              fullscreen={isLarge}
              padded
              css={{ zIndex: 3 }}
            >
              <Glow
                style={{
                  background: altBg.lighten(0.025),
                  transform: { x: '-20%', y: '-25%' },
                }}
              />
              <Slant
                inverseSlant
                slantGradient={[
                  Constants.useCasesSlantBg2,
                  Constants.useCasesSlantBg2,
                ]}
                css={{ zIndex: 2 }}
              />
              <LeftSide>
                <SubTitle size={4.5} italic>
                  Workplace<br />
                  operations
                </SubTitle>
                <Notification
                  if={isLarge}
                  title="Uber Receipts"
                  body="Your Thursday morning trip with Uber"
                  css={{
                    marginLeft: 'auto',
                    marginTop: 60,
                    marginBottom: -40,
                  }}
                />
                <div if={isLarge} css={{ height: '26%' }} />
                <section
                  css={{
                    textAlign: 'left',
                    display: 'block',
                    margin: isLarge ? [-70, 0, 0, '12%'] : 0,
                  }}
                >
                  <P
                    if={isLarge}
                    alpha={0.6}
                    size={2}
                    css={{ margin: [0, '25%', 10, 0] }}
                  >
                    Smarter unified knowledgebase
                  </P>
                  <P2 size={1.6}>
                    Smart profiles and project information, with relevant
                    conversations shown inline. Reduce pings for links, lost
                    discussions, and other common causes for interruptions.
                  </P2>
                </section>
                <Callout
                  if={isLarge}
                  css={
                    isLarge && {
                      marginLeft: '15%',
                      marginTop: 35,
                      textAlign: 'left',
                    }
                  }
                >
                  <P2 size={2} margin={0}>
                    The Orbit search model uses state of the art NLP that learns
                    your company corpus.
                  </P2>
                </Callout>
              </LeftSide>
              <RightSide inverse css={{ bottom: 0 }}>
                <div $$flex css={{ marginTop: isLarge ? '20%' : 0 }} />
                <P
                  if={isLarge}
                  alpha={0.6}
                  size={2}
                  css={{ margin: [0, '25%', 10, 0] }}
                >
                  Enabling deep work
                </P>
                <P2 size={1.6} css={{ marginRight: isLarge ? '20%' : 0 }}>
                  Use the power of Do Not Disturb in Slack without losing
                  synchronicity. The Orbit Home shows everything relevant and
                  summarized to each employeee. That means less notification
                  noise, and a better ability to focus.
                </P2>
                <Callout css={{ margin: [35, '15%', 0, 0], left: -45 }}>
                  <P2 size={2} margin={0}>
                    Pull, instead of being pushed by notifications.
                  </P2>
                </Callout>
              </RightSide>
            </SectionContent>
          </Section>
        )}
      </Media>
    )
  }
}

@view
export class UseCasesPage extends React.Component {
  render() {
    return (
      <usecases $$flex $$background={peachTheme.background}>
        <UI.Theme theme={peachTheme}>
          <TopoBg />
          <Header />
          <UseCasesIntro />
          <surround css={{ position: 'relative' }}>
            <SectionUseCaseCustomerSuccess />
            <SectionUseCaseReduceInterrupts />
            <SectionUseCaseRemoteTeams />
          </surround>
          <Footer />
        </UI.Theme>
      </usecases>
    )
  }
}
