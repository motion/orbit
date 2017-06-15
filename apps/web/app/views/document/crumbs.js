// @flow
import React from 'react'
import { view } from '@jot/black'
import { Icon } from '~/ui'

@view
export default class Crumbs {
  render({ docs }) {
    const crumbs = [
      { text: 'all', url: '/' },
      ...(docs || []).map(doc => ({ text: doc.title, url: doc.url() })),
    ]

    return (
      <crumbs>
        <items $$row>
          {crumbs.map((item, index) => (
            <item key={item.url} $$row>
              <text onClick={() => Router.go(item.url)} $text>
                {item.text}
              </text>
              <slash if={index !== crumbs.length - 1}>/</slash>
            </item>
          ))}
        </items>
      </crumbs>
    )
  }

  static style = {
    crumbs: {
      margin: [10, 0, 0, 45],
      height: 20,
    },
    item: {
      textTransform: 'capitalize',
      fontWeight: 'bold',
      color: 'black',
      cursor: 'default',
      transition: 'opacity 100ms ease-in',
    },
    text: {
      marginRight: 10,
      opacity: 0.4,
      '&:hover': {
        opacity: 1,
      },
    },
    slash: {
      opacity: 0.4,
      marginRight: 10,
    },
  }
}
