// @flow
import React from 'react'
import { view, log } from '@jot/black'
import { Icon } from '~/ui'
import { IS_ELECTRON } from '~/constants'
import Router from '~/router'
import type DocStore from './store'

type Props = {
  docs: DocStore,
}

@view
export default class Breadcrumbs {
  props: Props

  render({ docs }: Props) {
    if (!Array.isArray(docs)) {
      docs = []
    }
    const crumbs = [
      {
        text: <Icon size={10} name="home" color="#222" hoverColor="red" />,
        url: '/',
      },
      ...docs.map(doc => ({ text: doc.title, url: doc.url() })),
    ]

    return (
      <breadcrumbs>
        <items $$row>
          {crumbs.map((item, index) =>
            <item key={item.url} $$row>
              <text onClick={() => Router.go(item.url)} $text>
                {item.text}
              </text>
              <slash if={index !== crumbs.length - 1}>/</slash>
            </item>
          )}
        </items>
      </breadcrumbs>
    )
  }

  static style = {
    breadcrumbs: {
      fontSize: 22,
      padding: [5, 10],
      marginTop: -2,
      flexFlow: 'row',
    },
    items: {
      alignItems: 'center',
    },
    text: {
      cursor: 'pointer',
      fontSize: 12,
      margin: [0, 4],
      color: [0, 0, 0, 0.5],
      justifyContent: 'center',
      '&:hover': {
        color: 'red',
      },
    },
    slash: {
      opacity: 0.05,
      margin: [0, 2],
      fontWeight: 200,
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
