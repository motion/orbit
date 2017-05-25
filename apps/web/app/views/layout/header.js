import React from 'react'
import { view } from '~/helpers'
import { object } from 'prop-types'
import { Segment, Input, Link, Button, Icon } from '~/ui'
import { SIDEBAR_WIDTH, HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import Router from '~/router'
import { Document } from '@jot/models'
import Commander from '~/views/commander'

@view
export default class Header {
  render({ layoutStore }) {
    const { title, actions, header, doc, place } = App.activePage
    const { extraActions } = App

    return (
      <header
        $$draggable
        $hovered={layoutStore.headerHovered}
        onMouseEnter={() => (layoutStore.headerHovered = true)}
        onMouseLeave={() => (layoutStore.headerHovered = false)}
      >
        <nav>
          <Segment>
            <Button
              if={IS_ELECTRON}
              icon="minimal-left"
              chromeless
              $inactive={Router.atBack}
              onClick={() => Router.back()}
            />
            <Button
              if={IS_ELECTRON}
              chromeless
              $inactive={Router.atFront}
              icon="minimal-right"
              onClick={() => Router.forward()}
            />
            <Button if={false} icon="simple-add" tooltip="new" />
            <Button chromeless>
              Create
            </Button>
          </Segment>
        </nav>
        <bar $$centered $$flex $$row $$overflow="hidden">
          <Commander
            onSubmit={layoutStore.createDoc}
            onChange={layoutStore.ref('title').set}
          />
        </bar>
        <rest if={header || actions || extraActions} $$row>
          {header || null}
          <actions $extraActions if={extraActions}>
            {extraActions}
          </actions>
          <actions if={actions}>
            {actions}
            <Button
              chromeless
              icon={
                layoutStore.sidebar.active
                  ? 'arrow-min-right'
                  : 'arrow-min-left'
              }
              onClick={layoutStore.sidebar.toggle}
              $$marginRight={-6}
              color={[0, 0, 0, 0.5]}
            />
          </actions>
        </rest>
      </header>
    )
  }

  static style = {
    header: {
      background: [255, 255, 255, 0.1],
      zIndex: 1000,
      padding: [0, 10, 0, IS_ELECTRON ? 80 : 10],
      flexFlow: 'row',
      height: HEADER_HEIGHT,
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
      overflow: 'hidden',
    },
    hovered: {
      opacity: 1,
      transition: 'all ease-in 100ms',
      transitionDelay: '0',
    },
    rest: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    nav: {
      flexFlow: 'row',
      marginRight: 10,
      alignItems: 'center',
    },
    inactive: {
      opacity: 0.5,
      pointerEvents: 'none',
    },
    actions: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    extraActions: {
      marginRight: 10,
    },
  }
}
