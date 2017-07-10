// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'

@view
export default class SidebarMenu {
  render() {
    return (
      <sidebarmenu if={false} $$draggable css={{ padding: [10, 0, 0] }}>
        <UI.List
          size={1.2}
          background="transparent"
          items={[
            {
              primary: 'Home',
              icon: 'home',
              onClick: () => Router.go('/'),
            },
            { primary: 'Feed', icon: 'hum', onClick: _ => _ },
            { primary: 'Drafts', icon: 'paper', onClick: _ => _ },
          ]}
        />
      </sidebarmenu>
    )
  }
}
