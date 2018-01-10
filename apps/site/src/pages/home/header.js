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
  color: '#000', //Constants.colorSecondary.darken(0.5),
  alpha: 0.9,
}

const Banner = () => (
  <content
    $$row
    css={{
      margin: [-50, 0, 0],
      padding: [50, 0],
      width: '100%',
      position: 'relative',
      justifyContent: 'space-between',
    }}
  >
    <section
      css={{
        position: 'relative',
        zIndex: 11,
        width: '42%',
      }}
    >
      <View.Title selectable {...titleProps} textAlign="right">
        Orbit autonomously organizes
        <br />
        your company knowledge
      </View.Title>
    </section>

    <section
      css={{
        width: '42%',
        zIndex: 20,
      }}
    >
      <inner
        css={{
          position: 'relative',
          zIndex: 11,
          // left: 20,
          pointerEvents: 'none',
        }}
      >
        <text
          css={{
            position: 'absolute',
            // bottom: -220,
          }}
        >
          <View.Title {...titleProps} textAlign="left" selectable>
            & helps keep you up to date,<br />
            wherever you are.
          </View.Title>
        </text>
      </inner>
    </section>
  </content>
)

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
              maxHeight: '1vh',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <banner
              css={{
                padding: [40, 0],
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <UI.Text
                selectable
                color={Constants.colorSecondary.darken(0.5)}
                size={3.3}
                weight={200}
              >
                Autopilot for company knowledge
              </UI.Text>
            </banner>

            <div $$flex />

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
                  border: [8, Constants.colorMain],
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

            <Banner />
          </contents>
        </View.SectionContent>
      </View.Section>
    )
  }
}
