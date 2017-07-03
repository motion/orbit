import React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import * as UI from '@mcro/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import * as Commander from '~/views/commander'

@view
export default class Header {
  render({ layoutStore }) {
    // use sidebar.active so it binds to variable and rerenders
    layoutStore.sidebar.active

    return (
      <header $$draggable>
        <UI.Glow
          color={[255, 255, 255]}
          opacity={1}
          full
          resist={90}
          offsetTop={20}
        />
        <UI.Glint color={[255, 255, 255, 1]} borderRadius={5} />
        <bar>
          <UI.Segment
            $$margin={[0, 10, 0, 0]}
            itemProps={{ iconSize: 12, padding: [0, 6], chromeless: true }}
            $$flex="none"
          >
            <UI.Button
              if={IS_ELECTRON}
              icon="minimal-left"
              disabled={Router.atBack}
              onClick={() => Router.back()}
            />
            <UI.Button
              if={IS_ELECTRON}
              disabled={Router.atFront}
              icon="minimal-right"
              onClick={() => Router.forward()}
            />
            <UI.Button if={false} icon="home" onClick={() => Router.go('/')} />
          </UI.Segment>
          <Commander.Bar
            onOpen={() => (layoutStore.commanderOpen = true)}
            onClose={() => (layoutStore.commanderOpen = false)}
          />
        </bar>
        <rest $$row>
          <UI.SlotFill.Slot name="actions">
            {items =>
              <actions key={Math.random()}>
                {items}
                <UI.Button
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
          </UI.SlotFill.Slot>
        </rest>
      </header>
    )
  }

  static style = {
    header: {
      overflow: 'hidden',
      // background: [255, 255, 255, 0.1],
      boxShadow: [['inset', 0, 10, 20, [0, 0, 0, 0.05]]],
      zIndex: 500,
      padding: [0, 10, 0, IS_ELECTRON ? 80 : 10],
      flexFlow: 'row',
      height: HEADER_HEIGHT,
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
      position: 'relative',
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
