// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarMenu {
  render() {
    return (
      <sidebarmenu css={{ padding: [7, 0, 0] }}>
        <UI.Theme name="clear-dark">
          <UI.List
            size={1.3}
            itemProps={{
              padding: 15,
            }}
            items={[
              {
                primary: 'Home',
                icon: 'home',
              },
              {
                primary: 'Feed',
                icon: 'list',
                onClick: _ => _,
                children: false && [
                  { primary: 'Example 1' },
                  { primary: 'Example 2' },
                  { primary: 'Example 3' },
                ],
              },
              // { primary: 'Me', icon: 'hum', onClick: _ => _ },
              { primary: 'Drafts', icon: 'paper', onClick: _ => _ },
            ]}
          />
        </UI.Theme>
      </sidebarmenu>
    )
  }
}
