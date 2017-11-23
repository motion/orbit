import * as React from 'react'
// import * as UI from '@mcro/ui'
// import * as View from '~/views'
// import * as Constants from '~/constants'
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
                  opacity: 0.2,
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
              src="/figures/Hummingbird.svg"
              css={{
                margin: [20, 40, 0, -180],
                width: 125,
                height: 125,
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
                  opacity: 0.2,
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
                marginTop: -5,
                width: 155,
                height: 155,
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
              top: 40,
              left: 30,
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
              top: 40,
              right: 10,
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
      // background: [255, 255, 255, 0.1],
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
