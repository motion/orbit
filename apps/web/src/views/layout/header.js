import React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import * as UI from '@mcro/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import Explorer from './explorer/explorer'
import { OS } from '~/helpers/electron'
import Constants from '~/constants'

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
              //marginLeft: '-20%',
              top: 0,
              bottom: 0,
              left: '20%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            My App
          </centerside>

          <Explorer
            if={false}
            onOpen={() => (layoutStore.explorerOpen = true)}
            onClose={() => (layoutStore.explorerOpen = false)}
          />

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
            <UI.Row>
              <UI.Button chromeless margin={[0, 2]}>
                Share
              </UI.Button>
              <UI.Button
                chromeless
                margin={[0, 2]}
                onClick={() => {
                  OS.send('app-bar-toggle', Constants.APP_KEY)
                }}
                icon="add"
              />
            </UI.Row>
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
      marginLeft: IS_ELECTRON ? 78 : 10,
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
