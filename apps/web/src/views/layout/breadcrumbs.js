import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'

@view.attach('commanderStore')
@view
export default class Breadcrumbs {
  render({ commanderStore }) {
    const crumbs = [
      {
        text: <UI.Icon size={12} name="home" color="#ccc" hoverColor="red" />,
        url: '/',
      },
    ]

    log('crumbs', commanderStore.crumbs)
    if (commanderStore.crumbs && commanderStore.crumbs.map) {
      crumbs.push(
        commanderStore.crumbs.map(doc => ({
          text: doc.title,
          url: doc.url(),
        }))
      )
    }

    return (
      <breadcrumbs>
        <items $$row>
          {crumbs.map((item, index) =>
            <item key={item.url || index} $$row>
              <UI.Text onClick={() => Router.go(item.url)}>
                {item.text}
              </UI.Text>
              <slash if={index !== crumbs.length - 1 && index !== 0}>/</slash>
            </item>
          )}
        </items>
      </breadcrumbs>
    )
  }

  static style = {
    breadcrumbs: {
      userSelect: 'none',
      height: 38,
      fontSize: 22,
      padding: [0, 20],
      margin: [-5, 0, 0],
      flexFlow: 'row',
      // borderLeft: [4, '#ddd'],
    },
    items: {
      alignItems: 'center',
    },
    slash: {
      opacity: 0.025,
      margin: [0, 2],
      fontWeight: 200,
      fontSize: 12,
      pointerEvents: 'none',
    },
    nav: {
      margin: [0, 8, 0, 0],
      flexFlow: 'row',
      alignItems: 'center',
    },
    inactive: {
      opacity: 0.5,
      pointerEvents: 'none',
    },
  }
}
