import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Logo from './logo'
import Orbitals from './orbitals'

const dark1 = UI.color(Constants.colorMain)
  .darken(0.75)
  .toString()
const dark2 = UI.color(Constants.colorSecondary)
  .darken(0.75)
  .toString()

const gradientedText = {
  background: `
  -webkit-linear-gradient(
    30deg,
    ${UI.color(Constants.colorMain)
      .lighten(0.15)
      .toString()},
    ${UI.color(Constants.colorSecondary)
      .lighten(0.65)
      .toString()}
  )`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

@view
export default class Header {
  render() {
    return (
      <View.Section
        css={{
          background: `linear-gradient(-195deg, ${dark1}, ${dark2})`,
          // minHeight: Math.min(1100, window.innerHeight),
          position: 'relative',
          transform: {
            z: 0,
          },
        }}
      >
        <fadeOver
          $$fullscreen
          css={{
            zIndex: 101,
            background: `linear-gradient(-195deg, transparent, ${
              Constants.colorSecondary
            })`,
          }}
        />
        <fadeDown
          $$fullscreen
          css={{
            top: '20%',
            background: `linear-gradient(transparent, ${dark2})`,
            zIndex: 102,
          }}
        />

        <Orbitals />

        <visible css={{ position: 'relative', zIndex: 1000, flex: 1 }}>
          <header $$row if={false}>
            <View.SectionContent>
              <header
                $$row
                css={{
                  alignItems: 'center',
                  padding: [10, 0],
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <Logo />
              </header>
            </View.SectionContent>
          </header>

          <UI.Theme name="dark">
            <View.SectionContent
              css={{
                flex: 1,
                justifyContent: 'center',
                margin: 'auto',
              }}
            >
              <wrap>
                <View.Content padRight>
                  <View.Title
                    if={false}
                    size={5}
                    color="#fff"
                    fontWeight={100}
                    lineHeight={75}
                  >
                    Company knowledge, smarter.
                  </View.Title>

                  <View.Text size={3.3} fontWeight={100} css={gradientedText}>
                    Orbit is an assistant that tracks your wiki, chats,
                    documents, and anything relevant to your company.<br />
                  </View.Text>
                  <UI.Text size={2.5} fontWeight={200} css={gradientedText}>
                    Instant search & contextual answers, wherever you are.
                  </UI.Text>

                  <View.Text if={false} size={1.7}>
                    Scroll down to see it in action.
                  </View.Text>
                </View.Content>

                <arrows css={{ position: 'absolute', right: 0 }}>
                  <arrowVertical
                    css={{
                      position: 'absolute',
                      top: 200,
                      right: Constants.ORA_WIDTH / 2,
                      width: 10,
                      paddingLeft: 40,
                      height: 200,
                      // borderRight: [4, 'solid', '#fff'],
                      borderImage: 'linear-gradient(transparent, #fff) 1 100%',
                      borderWidth: 4,
                      borderRightStyle: 'solid',
                      opacity: 0.3,
                      alignItems: 'center',
                    }}
                  >
                    <UI.Arrow
                      css={{
                        position: 'absolute',
                        bottom: 0,
                        marginBottom: -30,
                        marginLeft: 2,
                      }}
                      color="#fff"
                      size={30}
                    />
                  </arrowVertical>
                </arrows>

                <logos
                  if={false}
                  css={{
                    flexFlow: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    margin: [40, 0, 0],
                  }}
                >
                  <UI.PassProps size={35} color="#fff">
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
            </View.SectionContent>
          </UI.Theme>
        </visible>
        <View.BottomSlant if={false} css={{ background: '#fff' }} />
      </View.Section>
    )
  }

  static style = {
    '@keyframes orbital0': {
      from: {
        transform: 'rotate(0deg) translateX(150px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(150px) rotate(-360deg)',
      },
    },
    '@keyframes orbital1': {
      from: {
        transform: 'rotate(0deg) translateX(300px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(300px) rotate(-360deg)',
      },
    },
    '@keyframes orbital2': {
      from: {
        transform: 'rotate(0deg) translateX(450px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(450px) rotate(-360deg)',
      },
    },
  }
}
