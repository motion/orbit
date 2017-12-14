import { view } from '@mcro/black'
import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import appleWatch from './helpers/appleWatch'

const width = 900
const height = 460

@view
export default class SectionIntegrations extends React.Component {
  setupWatch = ref => {
    if (!ref || this.props.blurred) {
      return
    }
    appleWatch(ref)
  }

  render() {
    return (
      <UI.Theme name="dark">
        <View.Section
          dark
          css={{
            padding: [60, 0],
            zIndex: 100000,
          }}
        >
          <View.SectionContent>
            <View.Title size={3}>Orbits works with you</View.Title>
            <View.SubTitle css={{ padding: [0, 400, 0, 0] }}>
              Don't add yet another source of truth, Orbit works with all your
              integrations.
            </View.SubTitle>
            <box
              css={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: 280,
                width: 340,
                background: '#fff',
                border: [1, [0, 0, 0, 0.05]],
                boxShadow: [[0, 0, 10, [0, 0, 0, 0.04]]],
                borderRadius: 10,
                padding: 20,
              }}
            >
              lorem ipsum2
            </box>
            <svg
              $watch
              viewBox="-1.855 -2.325 3.75 4.7"
              ref={this.setupWatch}
            />
          </View.SectionContent>
        </View.Section>
      </UI.Theme>
    )
  }

  static style = {
    watch: {
      width,
      height,
      margin: [40, 0],
      userSelect: 'none',
    },
  }
}
