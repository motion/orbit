import { view } from '@mcro/black'
import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'
import appleWatch from './helpers/appleWatch'

const width = 870
const height = 575

@view
export default class SectionIntegrations {
  setupWatch = ref => {
    if (!ref) {
      return
    }
    appleWatch(ref)
  }

  render() {
    return (
      <UI.Theme name="light">
        <View.Section padded css={{ background: '#fff' }}>
          <View.SectionContent $content>
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
      userSelect: 'none',
    },
  }
}
