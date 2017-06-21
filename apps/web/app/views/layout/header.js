import React from 'react'
import { view } from '@jot/black'
import { SlotFill, Button } from '~/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import Commander from './commander'

@view
export default class Header {
  render({ layoutStore }) {
    return (
      <header
        $$draggable
        $hovered={layoutStore.headerHovered}
        onMouseEnter={() => (layoutStore.headerHovered = true)}
        onMouseLeave={() => (layoutStore.headerHovered = false)}
      >
        <nav>
          <Commander.Input />
        </nav>
        <rest $$row>
          <SlotFill.Slot name="documentActions">
            {items =>
              <actions>
                {items}
              </actions>}
          </SlotFill.Slot>
          <SlotFill.Slot name="actions">
            {items =>
              <actions>
                {items}
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
              </actions>}
          </SlotFill.Slot>
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
    nav: {
      flex: 1,
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
    actions: {
      flexFlow: 'row',
      alignItems: 'center',
    },
  }
}
