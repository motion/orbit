import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import SectionContent from '~/views/sectionContent'
import Router from '~/router'
import { Slant, Title, P2, LeftSide, RightSide, Card } from '~/views'
import { Bauhaus } from '~/views/bauhaus'

@view
export class HomeFooter extends React.Component {
  render({ isLarge }) {
    const card1 = (
      <Card css={isLarge && { transform: { x: -30 } }}>
        <Card.Icon name="transportation_car" color="rgb(91.3%, 87%, 16.8%)" />
        <Card.Title>A new approach</Card.Title>
        <Card.Body>
          Orbit uses novel machine learning to enable fast, efficient and
          effective on-device search.
        </Card.Body>
      </Card>
    )

    const card2 = (
      <Card css={isLarge && { transform: { x: 30 } }}>
        <Card.Icon name="users_multiple" color="blue" />
        <Card.Title>Dramatically more simple</Card.Title>
        <Card.Body>
          No cloud or on-premise install means you can try Orbit completely
          securely in minutes.
        </Card.Body>
      </Card>
    )

    const card3 = (
      <Card css={isLarge && { transform: { x: -30 } }}>
        <Card.Icon name="social_logo-slack" color="green" />
        <Card.Title>Works with chat</Card.Title>
        <Card.Body>
          Slack is awesome, but noisy. Search with AI and peek into summarized
          and related conversations.
        </Card.Body>
      </Card>
    )
    return (
      <Page offset={2}>
        <SectionContent padded fullscreen fullscreenFs>
          <Bauhaus />
          <Slant inverseSlant {...firstSlant} {...bottomSlants} />
          <Slant {...secondSlant} {...bottomSlants} />
          <Slant inverseSlant {...thirdSlant} {...bottomSlants} />
          <LeftSide css={{ textAlign: 'left' }}>
            <div>
              <UI.View flex={1} />
              <content css={isLarge && { marginRight: 80 }}>
                <Title size={2.3} color="#333" css={{ marginBottom: 25 }}>
                  A new way to coordinate.
                </Title>
                <UI.PassProps size={1.35} sizeLineHeight={1.2} alpha={0.7}>
                  <P2>
                    As more people join your company it gets harder and harder
                    to keep everyone on the same page.
                  </P2>
                  <P2>
                    Orbit is a smart desktop app that sorts your cloud into
                    samrt search and exploration. We're making a secret weapon
                    for coordinating company knowledge.
                  </P2>
                  <P2 size={1.2} css={{ marginTop: 5 }}>
                    Read more to learn about{' '}
                    <a
                      href="/features"
                      onClick={Router.link('features')}
                      css={{
                        textDecoration: 'none',
                        color: '#6858D3',
                        fontWeight: 500,
                      }}
                    >
                      how it works
                    </a>{' '}
                    and{' '}
                    <a
                      href="/about"
                      onClick={Router.link('about')}
                      css={{
                        textDecoration: 'none',
                        color: '#6858D3',
                        fontWeight: 500,
                      }}
                    >
                      how we're thinking about it
                    </a>, or sign up for early access below.
                  </P2>
                </UI.PassProps>
              </content>
              <UI.View flex={1} />
            </div>
          </LeftSide>
          <RightSide
            noEdge
            css={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <card if={!isLarge}>
              {card1}
              {card2}
              {card3}
            </card>
            <cards if={isLarge}>
              <UI.Theme name="light">
                <UI.TiltHoverGlow
                  restingPosition={[0, 400]}
                  shadowProps={{
                    opacity: 0.1,
                    scale: 0.6,
                    blur: 40,
                    resist: 100,
                    offsetLeft: 0,
                  }}
                  tiltOptions={{ max: 10, perspective: 2000 }}
                >
                  {card1}
                </UI.TiltHoverGlow>
                <UI.TiltHoverGlow
                  restingPosition={[2000, 50]}
                  shadowProps={{
                    opacity: 0.1,
                    scale: 0.6,
                    blur: 40,
                    resist: 100,
                    offsetLeft: 0,
                  }}
                  tiltOptions={{ max: 10, perspective: 2000 }}
                >
                  {card2}
                </UI.TiltHoverGlow>
                <UI.TiltHoverGlow
                  restingPosition={[0, 0]}
                  shadowProps={{
                    opacity: 0.1,
                    scale: 0.6,
                    blur: 40,
                    resist: 99,
                    offsetLeft: -40,
                  }}
                  tiltOptions={{ max: 10, perspective: 2000 }}
                >
                  {card3}
                </UI.TiltHoverGlow>
              </UI.Theme>
            </cards>
          </RightSide>
        </SectionContent>
      </Page>
    )
  }
}
