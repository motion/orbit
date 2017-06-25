// @flow
import React from 'react'
import { view, log, watch } from '@jot/black'
import { Icon } from '~/ui'
import Router from '~/router'
import type DocStore from './store'

type Props = {
  docs: DocStore,
}

@view({
  store: class BreadcrumbStore {
    crumbs = watch(
      props => (props.document && props.document.getCrumbs()) || [] || []
    )
  },
})
export default class Breadcrumbs {
  props: Props

  render({ store }: Props) {
    if (!store.crumbs) {
      return <breadcrumbs />
    }

    const crumbs = [
      {
        text: <Icon size={12} name="home" color="#ccc" hoverColor="red" />,
        url: '/',
      },
      ...store.crumbs.map(doc => ({
        text: doc.title,
        url: doc.url(),
      })),
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
      padding: [0, 20, 10],
      marginTop: -8,
      flexFlow: 'row',
    },
    items: {
      alignItems: 'center',
    },
    text: {
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 400,
      margin: [0, 4],
      color: [0, 0, 0, 0.3],
      justifyContent: 'center',
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
