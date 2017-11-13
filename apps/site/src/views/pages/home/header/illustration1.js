import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'

@view
export default class Illustration1 {
  render(props) {
    return (
      <things
        $$row
        css={{
          flex: 1,
          justifyContent: 'center',
          userSelect: 'none',
        }}
        {...props}
      >
        <stage
          css={{
            height: 300,
            flexFlow: 'row',
            flex: 1,
            alignItems: 'flex-end',
          }}
        >
          <figure
            css={{
              marginRight: -30,
              marginBottom: 30,
              zIndex: 100,
              height: 185,
            }}
          >
            <bubble
              css={{
                width: 110,
                height: 110,
                margin: [0, 0, -65, 0],
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/figures/Cloud 2.svg"
                css={{
                  width: 150,
                  height: 150,
                }}
              />
              <img
                src="/logos/google-drive.svg"
                css={{
                  width: '35%',
                  height: '35%',
                  marginLeft: -5,
                  marginTop: 4,
                  position: 'absolute',
                }}
              />
            </bubble>
            <img
              src="/figures/Snail.svg"
              css={{
                margin: [0, 0, 0, -150],
                width: 150,
                height: 150,
                zIndex: 1000,
                alignSelf: 'flex-end',
              }}
            />
          </figure>

          <space css={{ minWidth: 100, flex: 1 }} />

          <figure css={{ marginRight: -30, zIndex: 100 }}>
            <bubble
              css={{
                width: 110,
                height: 110,
                margin: [0, 55, -50, 0],
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/figures/Cloud 2.svg"
                css={{
                  width: 150,
                  height: 150,
                }}
              />
              <img
                src="/logos/slack.svg"
                css={{
                  width: '35%',
                  height: '35%',
                  marginLeft: -5,
                  marginTop: 4,
                  position: 'absolute',
                }}
              />
            </bubble>
            <img
              src="/figures/Rabbit.svg"
              css={{
                width: 150,
                height: 150,
                alignSelf: 'flex-end',
                transform: { scaleX: -1 },
              }}
            />
          </figure>
        </stage>

        <sky $$fullscreen>
          <icon
            css={{
              transform: { rotate: '-10deg', scale: 0.65 },
              top: 30,
              left: 0,
            }}
          >
            <img
              src="/logos/base.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '15deg', scale: 0.65 },
              top: 10,
              right: 0,
            }}
          >
            <img
              src="/logos/twitter.svg"
              css={{
                width: '50%',
                height: '50%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '5deg', scale: 0.8 },
              top: 60,
              left: 200,
            }}
          >
            <img
              src="/logos/github-icon.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '-15deg', scale: 0.85 },
              top: 30,
              left: 130,
            }}
          >
            <img
              src="/logos/markdown.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>

          <icon
            css={{
              transform: { rotate: '15deg', scale: 0.9 },
              top: 20,
              left: 270,
            }}
          >
            <img
              src="/logos/zendesk.svg"
              css={{
                width: '60%',
                height: '60%',
              }}
            />
          </icon>
        </sky>

        <floor
          css={{
            position: 'absolute',
            bottom: 10,
            left: 120,
            right: 90,
            flexFlow: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
          }}
        >
          <pile css={{ margin: [0, 60, 10], position: 'relative', width: 30 }}>
            <icon
              css={{
                transform: { rotate: '10deg', scale: 0.8 },
                bottom: 80,
              }}
            >
              <img
                src="/logos/asana.svg"
                css={{
                  width: '80%',
                  height: '80%',
                }}
              />
            </icon>
            <icon
              css={{
                transform: { rotate: '-10deg', scale: 0.85 },
                bottom: 10,
                left: -40,
              }}
            >
              <img
                src="/logos/mixpanel.svg"
                css={{
                  width: '80%',
                  height: '80%',
                }}
              />
            </icon>
            <icon
              css={{
                transform: { rotate: '20deg', scale: 0.9 },
                bottom: 10,
                left: 50,
              }}
            >
              <img
                src="/logos/google-gmail.svg"
                css={{
                  width: '50%',
                  height: '50%',
                }}
              />
            </icon>
          </pile>
          <img
            if={false}
            src="/figures/Pinecomb.svg"
            css={{
              width: 80,
              height: 80,
              transform: { rotate: '-25deg' },
            }}
          />
        </floor>
      </things>
    )
  }

  static style = {
    icon: {
      // border: [1, [0, 0, 255, 0.075]],
      background: [255, 255, 255, 0.1],
      borderRadius: 10,
      // opacity: 0.25,
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
    },
  }
}

const dark1 = UI.color(Constants.colorMain)
  .darken(0.7)
  .toString()
const dark2 = UI.color(Constants.colorSecondary)
  .darken(0.45)
  .toString()

@view
class HomeHeader2 {
  render() {
    return (
      <View.Section
        css={{
          position: 'relative',
          background: `linear-gradient(-195deg, ${dark1}, ${dark2})`,
          overflow: 'hidden',
        }}
      >
        <Header />

        <View.SectionContent
          css={{
            margin: 'auto',
            padding: [300, 0, 50],
          }}
        >
          <content
            $$row
            css={{
              justifyContent: 'space-between',
            }}
          >
            <UI.Theme name="dark">
              <section
                css={{
                  marginTop: -70,
                  // marginBottom: 40,
                  height: 560,
                  position: 'relative',
                  width: '45%',
                  transform: {
                    y: -120,
                  },
                }}
              >
                <View.Title size={2.8} fontWeight={300} textAlign="right">
                  Company knowledge shouldn't be such a pain
                </View.Title>

                <inner
                  css={{
                    position: 'relative',
                    margin: [70, 0, 40, 0],
                    userSelect: 'none',
                  }}
                >
                  <img
                    src="/watercolor.png"
                    css={{
                      position: 'absolute',
                      top: 0,
                      opacity: 0.6,
                      left: -40,
                      width: 2022,
                      height: 904,
                      zIndex: 0,
                      transformOrigin: 'top left',
                      transform: { scale: 0.5 },
                      filter: 'hue-rotate(-45deg) brightness(0.99)',
                      margin: '-20%',
                    }}
                  />
                  <Illustration1 css={{ transform: { scale: 1 } }} />
                </inner>
              </section>
            </UI.Theme>
            <stripeBetween
              $$fullscreen
              css={{
                // left: 0,
                left: '50%',
                marginRight: -720,
                background: '#fff',
                zIndex: 10,
                transform: {
                  rotate: '98deg',
                  scale: 1,
                  y: 155,
                },
              }}
            />
            <section
              css={{
                marginTop: -20,
                width: '45%',
                zIndex: 20,
                position: 'relative',
                transform: {
                  y: -50,
                },
              }}
            >
              <inner
                css={{
                  position: 'relative',
                  minHeight: 250,
                  margin: [20, 0, 0],
                  userSelect: 'none',
                }}
              >
                <Illustration2 css={{ transform: { scale: 1 } }} />
              </inner>

              <text css={{ margin: [60, 0, 0, 40] }}>
                <View.Title
                  textAlign="left"
                  size={2.8}
                  fontWeight={300}
                  color={dark2}
                >
                  Orbit keeps your team in sync without hassle.
                </View.Title>

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

                <afterwards
                  if={false}
                  css={{
                    marginTop: 30,
                    fontFamily: 'Hand of Sean',
                    fontSize: 20,
                    color: Constants.colorMain,
                    opacity: 0.75,
                  }}
                >
                  & lets you stop worrying about the cloud.
                </afterwards>
              </text>
            </section>
          </content>
        </View.SectionContent>
      </View.Section>
    )
  }
}
