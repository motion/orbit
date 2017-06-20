// @flow
import React from 'react'
import { view } from '@jot/black'
import { Button, Segment } from '~/ui'
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
      { text: 'all', url: '/' },
      ...(docs || []).map(doc => ({ text: doc.title, url: doc.url() })),
    ]

    return (
      <crumbs>
        <nav>
          <Button
            if={false}
            icon="home"
            chromeless
            active={Router.isActive('/')}
            onClick={() => Router.go('/')}
          />
          <Segment
            itemProps={{ iconSize: 10, padding: [0, 2] }}
            $$marginLeft={3}
          >
            <Button
              if={IS_ELECTRON}
              icon="minimal-left"
              chromeless
              disabled={Router.atBack}
              onClick={() => Router.back()}
            />
            <Button
              if={IS_ELECTRON}
              chromeless
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
      margin: [5, 0, 0, 35],
      padding: [20, 20],
      flexFlow: 'row',
    },
    item: {
      textTransform: 'capitalize',
      fontWeight: 'bold',
      color: 'black',
      cursor: 'default',
      transition: 'opacity 100ms ease-in',
    },
    text: {
      fontSize: 12,
      marginRight: 10,
      opacity: 0.3,
      '&:hover': {
        opacity: 1,
      },
    },
    slash: {
      opacity: 0.4,
      marginRight: 10,
    },

    nav: {
      margin: [0, 5, 0, -35],
      flexFlow: 'row',
      alignItems: 'center',
    },
    inactive: {
      opacity: 0.5,
      pointerEvents: 'none',
    },
  }
}
