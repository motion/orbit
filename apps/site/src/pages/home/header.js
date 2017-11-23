import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'

const titleProps = {
  size: 2.5,
  fontWeight: 200,
}

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section dark>
        <View.SectionContent fullscreen>
          <View.Header />
          <View.Slant />

          <content
            $$row
            css={{
              margin: ['auto', 0],
              justifyContent: 'space-between',
              userSelect: 'none',
            }}
          >
            <UI.Theme name="dark">
              <section
                css={{
                  position: 'relative',
                  width: '45%',
                  marginTop: -90,
                }}
              >
                <View.Title {...titleProps} textAlign="right">
                  Company knowledge shouldn't be so messy
                </View.Title>
                <inner
                  css={{
                    position: 'relative',
                    margin: [10, 0, 0, 0],
                    userSelect: 'none',
                  }}
                >
                  <Illustration1 css={{ transform: { scale: 1 } }} />
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
                  height: 220,
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
