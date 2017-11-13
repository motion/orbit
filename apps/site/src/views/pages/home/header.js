import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Orbitals from './orbitals'

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
          css={{
            top: 100,
            position: 'absolute',
            right: -200,
            left: 'auto',
            transform: { scale: 1.75 },
          }}
        />

        <visible
          css={{
            padding: [50, 0, 50],
            position: 'relative',
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
                  <text css={{ padding: [40, 0] }}>
                    <UI.Text
                      size={3.8}
                      fontWeight={200}
                      padding={[0, 100, 0, 0]}
                      color="#000"
                    >
                      Orbit provides insight while you work or talk with{' '}
                      <span css={{ fontWeight: 600 }}>customers</span> &{' '}
                      <span css={{ fontWeight: 600 }}>teammates</span>.<br />
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
