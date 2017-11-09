import { view } from '@mcro/black'
import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'
import appleWatch from './helpers/appleWatch'

const width = 900
const height = 500

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
      <UI.Theme name="light">
        <View.Section
          css={{ padding: [60, 0], background: '#fff', zIndex: 100000 }}
        >
          <slant
            css={{
              position: 'absolute',
              top: -50,
              background: '#fff',
              left: -300,
              right: -300,
              height: 100,
              zIndex: 1200000,
              boxShadow: [[0, -50, 70, [0, 0, 0, 0.5]]],
              transform: {
                rotate: '-1deg',
              },
            }}
          />
          <bottomSlant
            css={{
              position: 'absolute',
              bottom: -50,
              background: '#fff',
              left: -300,
              right: -300,
              height: 100,
              zIndex: 1200000,
              boxShadow: [[0, 20, 20, [0, 0, 0, 0.025]]],
              transform: {
                rotate: '-1deg',
              },
            }}
          />
          <View.SectionContent $content>
            <View.Title size={3}>With anything you use</View.Title>
            <View.SubTitle color="#000">
              Ora works with you, by supporting nearly any integration you have.<br />
              Learn more.
            </View.SubTitle>
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
