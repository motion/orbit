import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Stage, Scene, Item } from '~/views/stage'

// keeping everyone on the same page.
// Orbit works with every app and fits into your current workflow.

const titleProps = {
  fontWeight: 200,
  color: Constants.colorSecondary.darken(0.6),
  alpha: 0.9,
}

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section secondary>
        <View.SectionContent fullscreen>
          <View.Header />

          <contents
            css={{
              flex: 1,
              maxHeight: '84.6%',
              justifyContent: 'space-around',
              zIndex: 10,
            }}
          >
            <div $$flex css={{ minHeight: '4%' }} />

            <banner
              css={{
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <UI.Text
                selectable
                color={Constants.colorSecondary.darken(0.75)}
                size={2}
                weight={900}
              >
                An always-on brain for your knowledge
              </UI.Text>
            </banner>

            <div $$flex css={{ minHeight: 10 }} />

            <UI.Title selectable size={2} {...titleProps} textAlign="center">
              Orbit brings the cloud offline,
              <br />
              making you smarter as you work.
            </UI.Title>

            <div $$flex css={{ minHeight: 30 }} />

            <desktop
              css={{
                margin: [0, -55],
                // maxWidth: 2048 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                zIndex: 10,
              }}
            >
              <desktopChrome
                css={{
                  border: [5, Constants.colorMain],
                  borderRadius: 4,
                  left: 20,
                  right: 20,
                }}
              >
                <video
                  src="/tmp/try3.mp4"
                  width={2048}
                  height={1152}
                  muted
                  autoPlay
                  loop
                  css={{ maxWidth: '100%', height: 'auto' }}
                />
              </desktopChrome>
              <stand
                css={{
                  position: 'relative',
                  left: 0,
                  height: 15,
                  width: 5,
                  background: Constants.colorMain,
                  alignSelf: 'center',
                  zIndex: 1000,
                }}
              />
              <base
                css={{
                  position: 'relative',
                  left: 0,
                  height: 5,
                  width: 190,
                  background: Constants.colorMain,
                  alignSelf: 'center',
                  zIndex: 1000,
                }}
              />
            </desktop>

            <div $$flex />
          </contents>
        </View.SectionContent>
      </View.Section>
    )
  }
}
