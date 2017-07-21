import React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import * as UI from '@mcro/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import ExplorerInput from './explorerInput'
import Notifications from '../notifications'

@view.attach('layoutStore')
@view
export default class ExplorerBar {
  render({ layoutStore }) {
    // use sidebar.active so it binds to variable and rerenders
    layoutStore.sidebar.active

    const btnProps = {
      iconSize: 12,
      padding: [0, 6],
      chromeless: true,
      glow: false,
    }

    return (
      <explorerbar $$draggable>
        <UI.Glint color={[255, 255, 255, 1]} borderRadius={5} />
        <bar>
          <UI.Button
            if={IS_ELECTRON}
            {...btnProps}
            theme="light"
            icon="minimal-left"
            disabled={Router.atBack}
            onClick={() => Router.back()}
          />
          <ExplorerInput
            onOpen={() => (layoutStore.explorerOpen = true)}
            onClose={() => (layoutStore.explorerOpen = false)}
          />
        </bar>
        <rest $$row $$centered>
          <UI.SlotFill.Slot name="actions">
            {items => {
              return (
                <actions>
                  {items}
                </actions>
              )
            }}
          </UI.SlotFill.Slot>
          <UI.Popover
            openOnClick
            overlay={[0, 0, 0, 0.05]}
            closeOnEscape
            background
            width={480}
            borderRadius={8}
            elevation={2}
            target={
              <UI.Button
                chromeless
                iconSize={20}
                circular
                size={1.333}
                badge={2}
                icon="circle-09"
              />
            }
          >
            <Notifications />
          </UI.Popover>
        </rest>
      </explorerbar>
    )
  }

  static style = {
    explorerbar: {
      // position: 'absolute',
      // top: 0,
      // right: 0,
      // left: 0,
      // overflow: 'hidden',
      // // background: [255, 255, 255, 0.1],
      zIndex: 500,
      padding: [0, 10],
      paddingLeft: IS_ELECTRON ? 78 : 10,
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
