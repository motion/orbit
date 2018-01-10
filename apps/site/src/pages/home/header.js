import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Stage, Scene, Item } from '~/views/stage'

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section
        secondary
        reverseGradient
        css={{ marginBottom: -Constants.ORA_PULL_UP }}
      >
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

          <View.Slant secondary />

          <contents
            css={{ alignItems: 'center', zIndex: 10, margin: ['auto', 0] }}
          >
            <banner css={{ alignItems: 'center', justifyContent: 'center' }}>
              <UI.Text color="#fff" size={2.25} weight={800}>
                Autopilot for company knowledge
              </UI.Text>

              <UI.Text
                color="#fff"
                size={1.8}
                weight={200}
                css={{ marginRight: '50%' }}
              >
                Orbit autonomously organizes your company’s knowledge and
                surfaces information when it is relevant, keeping everyone on
                the same page. Orbit works with every app and fits into your
                current workflow.
              </UI.Text>
            </banner>

            <desktop
              css={{
                maxWidth: 2048 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <desktopChrome
                css={{
                  border: [5, Constants.colorSecondary],
                  borderRadius: 10,
                  left: 20,
                  right: 20,
                }}
              >
                <video
                  src="/tmp/take2.mp4"
                  width={2048}
                  height={1152}
                  autoPlay
                  loop
                  css={{ maxWidth: '100%', height: 'auto' }}
                />
              </desktopChrome>
              <stand
                css={{
                  position: 'relative',
                  left: 0,
                  height: 20,
                  width: 5,
                  background: Constants.colorSecondary,
                  alignSelf: 'center',
                  zIndex: 1000,
                }}
              />
              <base
                css={{
                  position: 'relative',
                  left: 0,
                  height: 5,
                  width: 100,
                  background: Constants.colorSecondary,
                  alignSelf: 'center',
                  zIndex: 1000,
                }}
              />
            </desktop>
          </contents>
        </View.SectionContent>
      </View.Section>
    )
  }
}
