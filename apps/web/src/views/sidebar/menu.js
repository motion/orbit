// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarMenu {
  render() {
    return (
      <sidebarmenu>
        <UI.Theme name="clear">
          <UI.List
            items={[
              { primary: 'All Incoming', icon: 'inbox' },
              { primary: 'Drafts', icon: 'mail' },
            ]}
          />
        </UI.Theme>
      </sidebarmenu>
    )
  }
}
