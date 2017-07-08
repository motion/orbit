// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'

@view
export default class SidebarMenu {
  render() {
    return (
      <sidebarmenu $$draggable css={{ padding: [20, 0, 0] }}>
        <UI.Theme name="clear-dark">
          <UI.List
            size={1.3}
            background="transparent"
            items={[
              {
                primary: '',
                icon: 's-d',
                onClick: () => Router.go('/'),
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
