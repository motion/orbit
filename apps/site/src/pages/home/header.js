import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Stage, Scene, Item } from '~/views/stage'

// keeping everyone on the same page.
// Orbit works with every app and fits into your current workflow.

const titleProps = {
  size: 2.3,
  fontWeight: 200,
  color: Constants.colorSecondary.darken(0.6),
  alpha: 0.9,
}

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section secondary css={{ marginBottom: -Constants.ORA_PULL_UP }}>
        <View.SectionContent fullscreen>
          <View.Header />

          <contents
            css={{
              flex: 1,
              maxHeight: '84.6%',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <banner
              css={{
                padding: [40, 0, 0],
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <UI.Text
                selectable
                color={Constants.colorSecondary.darken(0.75)}
                size={3.3}
                weight={200}
              >
                Autopilot for company knowledge
              </UI.Text>
            </banner>

            <div $$flex />

            <UI.Title selectable {...titleProps} textAlign="center">
              Orbit organizes company knowledge
              <br />
              and keeps your team in sync.
            </UI.Title>

            <div $$flex />

            <desktop
              css={{
                marginTop: 20,
                maxWidth: 2048 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                zIndex: 10,
              }}
            >
              <desktopChrome
                css={{
                  border: [8, Constants.colorMain],
                  borderRadius: 10,
                  left: 20,
                  right: 20,
                }}
              >
                <video
                  src="/tmp/try3.mp4"
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
                  width: 70,
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
