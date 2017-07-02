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
              { primary: 'Me', icon: 'hum', onClick: _ => _ },
              { primary: 'Drafts', icon: 'paper', onClick: _ => _ },
              {
                primary: 'Browse',
                icon: 'list',
                onClick: _ => _,
                children: [
                  { primary: 'Example 1' },
                  { primary: 'Example 2' },
                  { primary: 'Example 3' },
                ],
              },
            ]}
          />
        </UI.Theme>
      </sidebarmenu>
    )
  }
}
