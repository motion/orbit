import React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import * as UI from '@mcro/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import Explorer from './explorer/explorer'

@view.attach('layoutStore')
@view
export default class Header {
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
      <UI.Theme name="clear-dark">
        <header $$draggable>
          <UI.Glint color={[255, 255, 255, 0.1]} borderRadius={5} />

          <leftside $$row $$centered>
            <UI.Button
              if={false && IS_ELECTRON}
              {...btnProps}
              theme="light"
              icon="minimal-left"
              disabled={Router.atBack}
              onClick={() => !Router.atBack && Router.back()}
            />
          </leftside>

          <centerside
            css={{
              position: 'absolute',
              width: '40%',
              overflow: 'hidden',
              marginLeft: '-20%',
              top: 0,
              bottom: 0,
              left: '50%',
            }}
          >
            <Explorer
              onOpen={() => (layoutStore.explorerOpen = true)}
              onClose={() => (layoutStore.explorerOpen = false)}
            />
          </centerside>

          <rightside $$row $$centered>
            <UI.SlotFill.Slot name="actions">
              {items => {
                return (
                  <actions>
                    {items}
                  </actions>
                )
              }}
            </UI.SlotFill.Slot>
            <UI.Button
              if={false}
              size={1.2}
              chromeless
              circular
              margin={[0, 2]}
              badge={layoutStore.sidebar.active ? false : 10}
              icon={layoutStore.sidebar.active ? 'arrminright' : 'aminleft'}
              onClick={layoutStore.sidebar.ref('active').toggle}
            />
          </rightside>
        </header>
      </UI.Theme>
    )
  }

  static style = {
    header: {
      position: 'relative',
      background: 'transparent',
      color: '#fff',
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
      alignItems: 'center',
      height: HEADER_HEIGHT,
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
    },
    leftside: {
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
