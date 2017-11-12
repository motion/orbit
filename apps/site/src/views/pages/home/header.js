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
  .darken(0.175)
  .toString()

const gradientedText = {
  background: `
  -webkit-linear-gradient(
    30deg,
    ${UI.color(Constants.colorMain)
      .darken(0.05)
      .toString()},
    ${UI.color(Constants.colorSecondary)
      .darken(0.15)
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
          background: '#f2f2f2',
          position: 'relative',
        }}
      >
        <fadeOver
          if={false}
          $$fullscreen
          css={{
            zIndex: 101,
            background: `linear-gradient(transparent, #f2f2f2)`,
          }}
        />

        <Orbitals
          planetStyles={{
            background: '#f2f2f2',
            border: [1, '#ccc'],
          }}
          css={{ top: -90, position: 'absolute', right: -100, left: 'auto' }}
        />

        <visible
          css={{
            padding: [150, 0, 50],
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
                  <text css={{ marginTop: -180 }}>
                    <View.Text
                      style={{
                        marginBottom: 100,
                      }}
                      size={3}
                      fontWeight={400}
                      css={gradientedText}
                    >
                      Orbit provides answers as you talk with{' '}
                      <span css={{ fontWeight: 600 }}>customers</span> &{' '}
                      <span css={{ fontWeight: 600 }}>teammates</span>.<br />
                    </View.Text>
                    <UI.Text
                      size={3.8}
                      fontWeight={200}
                      padding={[0, 100, 0, 0]}
                      css={gradientedTextLight}
                    >
                      It lives on your desktop and uses<br />
                      machine learning to guide you.
                    </UI.Text>

                    <View.Text if={false} size={1.7}>
                      Scroll down to see it in action.
                    </View.Text>
                  </text>
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
