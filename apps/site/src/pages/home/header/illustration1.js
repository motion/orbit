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
        css={{
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        {...props}
      >
        <stage
          css={{
            height: 400,
            width: 280,
            flexFlow: 'row',
            flex: 1,
            alignItems: 'flex-end',
          }}
        >
          <figure
            css={{
              marginRight: -90,
              marginLeft: 50,
              marginBottom: 115,
              zIndex: 100,
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
                margin: [30, 40, 35, -180],
                width: 80,
                height: 80,
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
                margin: [0, 20, -50, 0],
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/logos/slack.svg"
                css={{
                  marginLeft: -20,
                  width: '35%',
                  height: '35%',
                  position: 'absolute',
                }}
              />
            </bubble>
            <img
              src="/figures/Rabbit.svg"
              css={{
                marginBottom: 20,
                width: 110,
                height: 110,
                alignSelf: 'flex-end',
                transform: { scaleX: -1 },
              }}
            />
          </figure>
        </stage>

        <sky $$fullscreen>
          <icon
            css={{
              top: 40,
              left: 80,
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
              top: 160,
              right: 80,
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
              top: 160,
              left: 170,
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
              left: 170,
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
          <pile css={{ margin: [0, 60, 10], position: 'relative', width: 170 }}>
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
                src="/logos/intercom.svg"
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
        </floor>
      </things>
    )
  }

  static style = {
    icon: {
      borderRadius: 10,
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
  }
}
