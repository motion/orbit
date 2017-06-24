// @flow
import React from 'react'
import { view } from '@jot/black'
import { Icon, Button, Segment } from '~/ui'
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
    const crumbs = [
      {
        text: <Icon size={10} name="home" color="#222" hoverColor="red" />,
        url: '/',
      },
      ...(docs || []).map(doc => ({ text: doc.title, url: doc.url() })),
    ]

    return (
      <crumbs if={false}>
        <nav>
          <Segment
            itemProps={{
              iconSize: 12,
              padding: [0, 6],
              height: 25,
              chromeless: true,
            }}
          >
            <Button
              if={IS_ELECTRON}
              icon="minimal-left"
              disabled={Router.atBack}
              onClick={() => Router.back()}
            />
            <Button
              if={IS_ELECTRON}
              disabled={Router.atFront}
              icon="minimal-right"
              onClick={() => Router.forward()}
            />
            <Button if={false} chromeless icon="simple-add" tooltip="new" />
          </Segment>
        </nav>

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
      </crumbs>
    )
  }

  static style = {
    crumbs: {
      zIndex: 2,
      background: '#fff',
      padding: [5, 10, 6],
      borderTop: [1, '#eee', 'dotted'],
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
      opacity: 0.1,
      margin: [0, 4],
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
