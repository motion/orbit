import { Header, Footer } from '~/components'
import {
  FeatureSubTitle,
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

const altBg = UI.color('#F9F5FA')
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
              marginTop: -window.innerHeight / 2,
            }}
          >
            <SectionContent padded fullscreen>
              <Slant
                inverseSlant
                slantBackground={altBg.darken(0.05)}
                css={{ zIndex: 2 }}
              />
              <HalfSection>
                <div $$flex />
                <Title
                  color="#111"
                  italic
                  size={2.3}
                  margin={[0, '10%', 10, 0]}
                >
                  Powerful answers for teams.
                </Title>
                <P size={1.2} alpha={0.9} fontWeight={500}>
                  <a onClick={scrollTo('#customer-success')}>
                    Customer Success
                  </a>{' '}
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#reduce-interrupts')}>Developers</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a onClick={scrollTo('#remote-teams')}>Onboarding</a>
                </P>
              </HalfSection>
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
                  Your org,<br />
                  organized
                </SubTitle>
                <div if={isLarge} css={{ height: '26%' }} />
                <section
                  css={{
                    textAlign: 'left',
                    display: 'block',
                    margin: isLarge ? [-40, 0, 0, '10%'] : 0,
                  }}
                >
                  <FeatureSubTitle>Beautiful unified profiles</FeatureSubTitle>
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
                <FeatureSubTitle>Home for your team</FeatureSubTitle>
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
                  <SubTitle if={!isLarge} size={4.5} italic>
                    Customer<br />Success
                  </SubTitle>
                  <FeatureSubTitle>
                    Reduce onboarding time by 1/3
                  </FeatureSubTitle>
                  <P2 size={1.6} css={{ margin: isLarge ? [0, 0, 35, 0] : 0 }}>
                    Onboarding is hard, and ties up your experienced people.
                    Orbit's automatic realtime contextual search speeds it up.
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
                <React.Fragment if={isLarge}>
                  <div $$flex css={{ marginTop: '5%' }} />
                  <SubTitle size={4.5} italic>
                    Customer<br />Success
                  </SubTitle>
                  <div $$flex css={{ marginTop: '10%' }} />
                  <FeatureSubTitle>Your CSAT secret weapon</FeatureSubTitle>
                </React.Fragment>
                <P2 size={1.6} css={isLarge && { marginRight: '15%' }}>
                  Sales chat requires intimate knowledge of your product. Orbit
                  sits side by side with your success team as they chat on
                  providing realtime answers.
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
                  Focus &<br />
                  understand
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
                  <FeatureSubTitle>Smarter unified knowledge</FeatureSubTitle>
                  <P2 size={1.6}>
                    Profiles and project information keep people from pinging
                    each other. Stop losing links, discussions, and more.
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
                    A sense of unity and better insight for your teams.
                  </P2>
                </Callout>
              </LeftSide>
              <RightSide inverse css={{ bottom: 0 }}>
                <div if={isLarge} $$flex css={{ marginTop: '20%' }} />
                <FeatureSubTitle>Enabling deep work</FeatureSubTitle>
                <P2 size={1.6} css={{ marginRight: isLarge ? '20%' : 0 }}>
                  Do Not Disturb Slack without losing synchronicity. Orbit Home
                  is a smarter way to do notifications. Less noise, and a better
                  ability to focus.
                </P2>
                <Callout
                  if={isLarge}
                  css={{ margin: [35, '15%', 0, 0], left: -45 }}
                >
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
