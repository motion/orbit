import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'
import { Stage, Scene, Item } from '~/views/stage'

const titleProps = {
  size: 2.7,
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

          <Stage if={false}>
            <Scene>
              <Item>thing</Item>
            </Scene>
            <Scene>
              <Item>thing</Item>
            </Scene>
            <Scene>
              <Item>thing</Item>
            </Scene>
          </Stage>

          <View.Slant dark />

          <content
            $$row
            css={{
              margin: ['auto', 0],
              position: 'relative',
              justifyContent: 'space-between',
            }}
          >
            <section
              css={{
                position: 'relative',
                zIndex: 11,
                width: '45%',
                // marginTop: -20,
              }}
            >
              <View.Title
                selectable
                {...titleProps}
                fontWeight={300}
                textAlign="right"
              >
                <span css={{ marginRight: -10 }}>A new type of tool</span>
                <br />
                <span className="hlword">that understands you</span>
              </View.Title>
            </section>

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
                  // left: 20,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                <text
                  css={{
                    position: 'absolute',
                    // bottom: -220,
                  }}
                >
                  <View.Title
                    {...titleProps}
                    textAlign="left"
                    color={'#fff'}
                    selectable
                  >
                    And augments your OS <br />
                    <span css={{ marginLeft: -10 }}>
                      with what you <span className="hlword">should know</span>
                    </span>
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
