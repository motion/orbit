import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'
import Animated from 'animated/lib/targets/react-dom'

window.Animated = Animated

const titleProps = {
  size: 2.85,
  fontWeight: 200,
}

const animations = {
  first: new Animated.Value(0),
  second: new Animated.Value(0),
  third: new Animated.Value(0),
}

Animated.spring(animations.first, { toValue: 0 }).start()

setTimeout(() => {
  Animated.spring(animations.first, { toValue: 1, speed: 0 }).start()
}, 0)

@view
export default class HomeHeader {
  render() {
    const ringFill = Constants.colorSecondary.darken(0.15).toString()

    return (
      <View.Section darkInverse css={{ marginBottom: -Constants.ORA_PULL_UP }}>
        <View.SectionContent fullscreen>
          <View.Header />

          <Animated.div
            style={{
              transform: [{ scale: animations.first }],
              width: 100,
              height: 100,
              background: 'red',
            }}
          >
            Test Div
          </Animated.div>

          <View.Slant dark />
          <content
            $$row
            css={{
              margin: ['auto', 0],
              justifyContent: 'space-between',
            }}
          >
            <UI.Theme name="dark">
              <section
                css={{
                  position: 'relative',
                  zIndex: 11,
                  width: '45%',
                  marginTop: -20,
                }}
              >
                <View.Title selectable {...titleProps} textAlign="right">
                  <span css={{ marginRight: -10 }}>We follow</span>
                  <br />
                  what you do
                </View.Title>
                <inner
                  css={{
                    position: 'relative',
                    margin: [-130, 10, 0, 0],
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: -1,
                  }}
                >
                  <Illustration1
                    css={{
                      transform: { scale: 1.6 },
                    }}
                  />
                  <View.Ring
                    width={420}
                    fill={ringFill}
                    css={{
                      position: 'absolute',
                      top: -235,
                      left: -20,
                      zIndex: -10,
                      transform: {
                        rotate: '70deg',
                      },
                    }}
                  />
                  <View.Ring
                    width={420}
                    fill={ringFill}
                    css={{
                      position: 'absolute',
                      top: -585,
                      left: -20,
                      zIndex: -10,
                      transform: {
                        rotate: '170deg',
                        scale: 0.5,
                      },
                    }}
                  />
                </inner>
              </section>
            </UI.Theme>

            <section
              css={{
                width: '45%',
                zIndex: 20,
              }}
            >
              <inner
                css={{
                  position: 'relative',
                  zIndex: 11,
                  height: 250,
                  left: 20,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                <Illustration2 css={{ transform: { y: 20, scale: 1.2 } }} />
                <View.Bubble
                  fill={UI.color(Constants.colorMain)
                    .darken(0.15)
                    .toString()}
                  width={400}
                  css={{
                    position: 'absolute',
                    top: -235,
                    left: -20,
                    zIndex: -10,
                  }}
                />
                <text
                  css={{
                    position: 'absolute',
                    bottom: -220,
                  }}
                >
                  <View.Title
                    {...titleProps}
                    textAlign="left"
                    color={'#fff'}
                    selectable
                  >
                    And show you <br />
                    <span css={{ marginLeft: -2 }}>what you should know</span>
                  </View.Title>
                </text>
              </inner>
            </section>
          </content>
        </View.SectionContent>
      </View.Section>
    )
  }
}
