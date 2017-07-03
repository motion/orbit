import React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import { Segment, SlotFill, Button } from '@mcro/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import * as Commander from '~/views/commander'

@view
export default class Header {
  render({ layoutStore }) {
    // use sidebar.active so it binds to variable and rerenders
    layoutStore.sidebar.active

    return (
      <header $$draggable>
        <bar>
          <Segment
            $$margin={[0, 10, 0, 0]}
            itemProps={{ iconSize: 12, padding: [0, 6], chromeless: true }}
            $$flex="none"
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
            <Button if={false} icon="home" onClick={() => Router.go('/')} />
          </Segment>
          <Commander.Bar
            onOpen={() => (layoutStore.commanderOpen = true)}
            onClose={() => (layoutStore.commanderOpen = false)}
          />
        </bar>
        <rest $$row>
          <Commander.Bar />
          <SlotFill.Slot name="actions">
            {items =>
              <actions>
                {items}
                <Button
                  chromeless
                  spaced
                  size={0.7}
                  margin={[0, -5, 0, 0]}
                  icon={
                    layoutStore.sidebar.active
                      ? 'arrow-min-right'
                      : 'arrow-min-left'
                  }
                  onClick={layoutStore.sidebar.toggle}
                  color={[0, 0, 0, 0.3]}
                />
              </actions>}
          </SlotFill.Slot>
        </rest>
      </header>
    )
  }

  static style = {
    header: {
      overflow: 'hidden',
      background: [255, 255, 255, 0.1],
      zIndex: 500,
      padding: [0, 10, 0, IS_ELECTRON ? 80 : 10],
      flexFlow: 'row',
      height: HEADER_HEIGHT,
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
    },
    bar: {
      flex: 1,
      flexFlow: 'row',
      alignItems: 'center',
    },
    crumbs: {
      height: 0,
    },
    rest: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    actions: {
      flexFlow: 'row',
      alignItems: 'center',
    },
  }
}
