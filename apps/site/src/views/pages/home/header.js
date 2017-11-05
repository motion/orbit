import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'

const headerBg = '#111'

@view
export default class Header {
  render() {
    return (
      <View.Section
        css={{
          background: '#000',
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
            background: `linear-gradient(${headerBg}, #000)`,
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
                <View.Title size={4}>
                  A smart assistant for your company.
                </View.Title>

                <View.Text size={2.2}>
                  Orbit is a simple, always on app that provides relevant
                  context as you work.<br />
                  <View.Text size={1.7} opacity={0.5}>
                    Scroll down to see how it works.
                  </View.Text>
                  <br />
                </View.Text>

                <hr />
              </View.Content>

              <logos
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
                margin: [200, -600, 200, 0],
              }}
            >
              <contain $$fullscreen>
                <circle
                  css={{
                    margin: 'auto',
                    border: [1, 'blue'],
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
                    border: [1, 'blue'],
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
                    border: [1, 'blue'],
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
                    border: [1, 'blue'],
                    width: 1000,
                    height: 1000,
                    borderRadius: 1000000000,
                    opacity: 0.4,
                  }}
                />
                {['mail', 'cool', 'what'].map((n, i) => (
                  <contain $$fullscreen key={i}>
                    <UI.Icon
                      name={n}
                      color="#fff"
                      size={30}
                      css={{
                        animation: `orbital${i} 4s linear infinite`,
                        margin: 'auto',
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
        transform: 'rotate(0deg) translateX(500px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(500px) rotate(-360deg)',
      },
    },
  }
}
