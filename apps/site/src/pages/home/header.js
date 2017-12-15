import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'

const titleProps = {
  size: 2.85,
  fontWeight: 200,
}

@view
export default class HomeHeader {
  render() {
    const ringFill = Constants.colorSecondary.darken(0.15).toString()

    return (
      <View.Section darkInverse css={{ marginBottom: -Constants.ORA_PULL_UP }}>
        <View.SectionContent fullscreen>
          <View.Header />
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
                  <span css={{ marginRight: -10 }}>Company knowledge</span>
                  <br />
                  shouldn't be so messy
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
                    Orbit keeps your team<br />
                    in sync,{' '}
                    <span css={{ marginLeft: -2 }}>without hassle</span>
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
