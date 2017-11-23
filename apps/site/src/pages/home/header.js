import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'
import { throttle } from 'lodash'

const titleProps = {
  size: 2.5,
  fontWeight: 200,
}

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section
        css={{
          position: 'relative',
          background: `#000`,
          overflow: 'hidden',
        }}
      >
        <View.SectionContent fullscreen>
          <View.Header />

          <center
            css={{
              position: 'absolute',
              top: 0,
              left: '50%',
              bottom: 0,
              width: 1,
              background: 'red',
              zIndex: 100000,
            }}
          />

          <View.Slant />

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
                  width: '45%',
                }}
              >
                <View.Title {...titleProps} textAlign="right">
                  Company knowledge shouldn't be so messy
                </View.Title>

                <inner
                  css={{
                    position: 'relative',
                    margin: [35, 0, 0, 0],
                    userSelect: 'none',
                  }}
                >
                  <img
                    if={false}
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

            <section
              css={{
                width: '45%',
                zIndex: 20,
                position: 'relative',
              }}
            >
              <inner
                css={{
                  position: 'relative',
                  minHeight: 220,
                  userSelect: 'none',
                }}
              >
                <Illustration2 css={{ transform: { scale: 1 } }} />
              </inner>

              <text css={{ margin: [45, 0, 0, 20] }}>
                <View.Title
                  {...titleProps}
                  textAlign="left"
                  color={Constants.dark2}
                >
                  Orbit keeps your team in sync, without hassle
                </View.Title>
              </text>
            </section>
          </content>
        </View.SectionContent>
      </View.Section>
    )
  }
}
