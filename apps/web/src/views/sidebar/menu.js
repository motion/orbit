// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarMenu {
  render() {
    return (
      <sidebarmenu>
        <UI.List
          items={[
            { primary: 'Inbox', icon: 'mail' },
            { primary: 'Inbox', icon: 'mail' },
          ]}
        />
      </sidebarmenu>
    )
  }
}
