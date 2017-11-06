import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'

const headerMain = '#4f78de'
const headerSecondary = '#7d43bc'
const orbitLineColor = 'pink'

@view
export default class Header {
  render() {
    return (
      <View.Section
        css={{
          background: `linear-gradient(-195deg, ${headerMain}, ${headerSecondary})`,
          minHeight: 880,
          position: 'relative',
          transform: {
            z: 0,
          },
        }}
      >
        <fadeDown
          css={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 500,
            background: `linear-gradient(${UI.color(headerSecondary)
              .alpha(0)
              .toString()}, #000)`,
            zIndex: 1,
            transform: {
              z: 0,
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
          <View.SectionContent>
            <thing
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
            </thing>
          </View.SectionContent>
        </header>

        <UI.Theme name="dark">
          <View.SectionContent
            css={{
              flex: 1,
              justifyContent: 'center',
              minHeight: 800,
              padding: [200, 0],
            }}
          >
            <wrap>
              <View.Content padRight>
                <View.Title size={4} color={UI.color(headerMain).lighten(0.35)}>
                  <div
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
                    A smart assistant for your company.
                  </div>
                </View.Title>

                <View.Text size={2.2}>
                  Orbit is a simple, always on app that provides relevant
                  context as you work.<br />
                  <View.Text size={1.7} opacity={0.5}>
                    Scroll down to see how it works.
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
                    right: -25,
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
                <UI.PassProps
                  size={35}
                  color={Constants.colorTeal}
                  opacity={0.7}
                >
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

            <section
              css={{
                position: 'relative',
                height: 1000,
                width: 1000,
                margin: [-200, -600, -200, 0],
                zIndex: -1,
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
                    <UI.Icon
                      name={n}
                      color="#fff"
                      size={30}
                      css={{
                        animation: `orbital${i % 3} ${(i + 1) *
                          20}s linear infinite`,
                        animationDelay: `${i * 100}ms`,
                        margin: 'auto',
                        opacity: Math.random(),
                      }}
                    />
                  </contain>
                ))}
              </contain>
            </section>
          </View.SectionContent>
        </UI.Theme>
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
