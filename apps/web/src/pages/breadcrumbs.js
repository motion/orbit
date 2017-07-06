import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'

@view.attach('commanderStore')
@view
export default class Breadcrumbs {
  render({ commanderStore }) {
    let crumbs = [
      {
        text: <UI.Icon size={12} name="home" color="#ccc" hoverColor="red" />,
        url: '/',
      },
    ]

    if (commanderStore.crumbs && commanderStore.crumbs.length) {
      crumbs = crumbs.concat(
        commanderStore.crumbs.map(doc => ({
          text: doc.title || 'nulll',
          url: doc.url(),
        }))
      )
    }

    return (
      <breadcrumbs>
        <items $$row $$flex>
          {crumbs.map((item, index) =>
            <item key={index} $$row>
              <slash if={index !== 0}>/</slash>
              <UI.Text onClick={() => Router.go(item.url)}>
                {item.text}
              </UI.Text>
            </item>
          )}
        </items>
      </breadcrumbs>
    )
  }

  static style = {
    breadcrumbs: {
      userSelect: 'none',
      height: 25,
      fontSize: 22,
      padding: [0, 20],
      margin: 0,
      flexFlow: 'row',
    },
    items: {
      alignItems: 'center',
    },
    slash: {
      opacity: 0.25,
      margin: [0, 4],
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
