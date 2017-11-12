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
      .darken(0.45)
      .toString()},
    ${UI.color(Constants.colorSecondary)
      .darken(0.65)
      .toString()}
  )`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const gradientedTextLight = {
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
          background: dark2,
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
            background: `linear-gradient(transparent, ${
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

        <Orbitals
          css={{ position: 'absolute', left: 1200, transform: { scale: 1.2 } }}
        />

        <visible
          css={{
            padding: [200, 0, 0],
            position: 'relative',
            zIndex: 1000,
            flex: 1,
          }}
        >
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
                  <View.Text
                    style={{
                      marginTop: -100,
                      marginBottom: 100,
                    }}
                    size={3}
                    fontWeight={800}
                    color="#fff"
                  >
                    Orbit answers questions your customers & teammates ask
                    without you lifting a finger.<br />
                  </View.Text>
                  <UI.Text
                    size={2.5}
                    fontWeight={200}
                    css={gradientedTextLight}
                  >
                    It's an always on assistant that uses Machine Learning to
                    serve contextual answers, wherever you are.
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
