import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'

const headerMain = '#4f78de'
const headerSecondary = '#7d43bc'
const orbitLineColor = UI.color(headerMain).darken(0.25)

@view
export default class Header {
  render() {
    return (
      <View.Section
        css={{
          background: `linear-gradient(-195deg, ${headerMain}, ${headerSecondary})`,
          minHeight: 400,
          paddingBottom: 200,
          position: 'relative',
          transform: {
            z: 0,
          },
          marginBottom: -100,
        }}
      >
        <fadeOver
          $$fullscreen
          css={{
            zIndex: 101,
            background: `linear-gradient(-195deg, transparent, ${headerSecondary})`,
          }}
        />

        <fadeDown
          css={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 320,
            background: `linear-gradient(${UI.color(headerSecondary)
              .alpha(0)
              .toString()}, #111)`,
            zIndex: 1000000,
            transform: {
              z: 0,
            },
          }}
        />

        <section
          $$fullscreen
          css={{
            position: 'relative',
            height: 1000,
            width: 1000,
            margin: [-200, -1800, -780, 400],
            zIndex: 100,
          }}
        >
          <contain $$fullscreen>
            <circle
              css={{
                margin: 'auto',
                border: [1, orbitLineColor],
                width: 100,
                height: 100,
                borderRadius: 1000000000,
              }}
            />
          </contain>
          <contain $$fullscreen>
            <circle
              css={{
                margin: 'auto',
                border: [1, orbitLineColor],
                width: 300,
                height: 300,
                borderRadius: 1000000000,
                opacity: 0.8,
              }}
            />
          </contain>
          <contain $$fullscreen>
            <circle
              css={{
                margin: 'auto',
                border: [1, orbitLineColor],
                width: 600,
                height: 600,
                borderRadius: 1000000000,
                opacity: 0.7,
              }}
            />
          </contain>
          <contain $$fullscreen>
            <circle
              css={{
                margin: 'auto',
                border: [1, orbitLineColor],
                width: 900,
                height: 900,
                borderRadius: 1000000000,
                opacity: 0.4,
              }}
            />
            {[
              'mail',
              'cool',
              'what',
              'how',
              'can',
              'this',
              'be',
              'mail',
              'cool',
              'what',
              'how',
              'can',
              'this',
              'be',
            ].map((n, i) => (
              <contain $$fullscreen key={i}>
                <planet
                  css={{
                    borderRadius: 100,
                    background: '#000',
                    width: 40,
                    height: 40,
                    margin: 'auto',
                    animation: `orbital${i % 3} ${(i + 1) *
                      20}s linear infinite`,
                    animationDelay: `${i * 100}ms`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UI.Icon name={n} color={headerSecondary} size={20} />
                </planet>
              </contain>
            ))}
          </contain>
        </section>

        <visible css={{ position: 'relative', zIndex: 1000 }}>
          <header $$row>
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
                <logos
                  css={{
                    // background: '#fff',
                    alignItems: 'center',
                    flexFlow: 'row',
                    padding: 10,
                    margin: [-10, -10, -10, -20],
                  }}
                >
                  <View.Icon
                    fill={'#fff'}
                    css={{
                      height: 45,
                      margin: [-10, 10, -10, -5],
                    }}
                  />
                  <View.Logo css={{ height: 40 }} fill={'#fff'} />
                </logos>
              </header>
            </View.SectionContent>
          </header>

          <UI.Theme name="dark">
            <View.SectionContent
              css={{
                flex: 1,
                justifyContent: 'center',
                padding: [250, 0],
              }}
            >
              <wrap>
                <View.Content padRight>
                  <View.Title size={4} color="#fff">
                    Company knowledge, smarter.
                  </View.Title>

                  <View.Text
                    size={2.2}
                    css={{
                      background: `
                      -webkit-linear-gradient(
                        30deg,
                        ${UI.color(headerMain)
                          .lighten(0.15)
                          .toString()},
                        ${UI.color(headerSecondary)
                          .lighten(0.65)
                          .toString()}
                      )`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Your wiki, chats, documents, and much more in a smart
                    assistant.<br />
                    <br />
                    On your desktop with instant search and contextual help.
                    <View.Text size={1.7} opacity={0.5}>
                      Scroll down to see it in action.
                    </View.Text>
                    <br />
                  </View.Text>

                  <View.Hr />
                </View.Content>

                <arrows>
                  <arrowVertical
                    css={{
                      position: 'absolute',
                      top: 350,
                      right: 0,
                      width: 10,
                      paddingLeft: 40,
                      height: 200,
                      borderRight: [5, 'dashed', [255, 255, 255, 0.5]],
                      alignItems: 'center',
                    }}
                  >
                    <UI.Arrow
                      css={{
                        position: 'absolute',
                        bottom: 0,
                        marginBottom: -34,
                        marginLeft: 3,
                      }}
                      color="white"
                      size={30}
                      opacity={0.5}
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
