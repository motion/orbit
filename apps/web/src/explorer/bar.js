import React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import * as UI from '@mcro/ui'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import Input from './input'

@view.attach('layoutStore')
@view
export default class ExplorerBar {
  render({ layoutStore }) {
    // use sidebar.active so it binds to variable and rerenders
    layoutStore.sidebar.active

    const btnProps = { iconSize: 12, padding: [0, 6], chromeless: true }

    return (
      <explorerbar>
        <UI.Glint color={[255, 255, 255, 1]} borderRadius={5} />
        <bar>
          <UI.Segment $$margin={[0, 10, 0, 0]} $$flex="none">
            <UI.Popover
              openOnHover
              delay={800}
              elevation={2}
              borderRadius={8}
              distance={0}
              forgiveness={2}
              towards="right"
              target={
                <UI.Button
                  if={IS_ELECTRON}
                  {...btnProps}
                  theme="light"
                  icon="minimal-left"
                  disabled={Router.atBack}
                  onClick={() => Router.back()}
                />
              }
            >
              <UI.Segment>
                <UI.Button
                  if={IS_ELECTRON}
                  {...btnProps}
                  disabled={Router.atFront}
                  icon="minimal-right"
                  onClick={() => Router.forward()}
                />
                <UI.Button
                  {...btnProps}
                  icon="home"
                  onClick={() => Router.go('/')}
                />
              </UI.Segment>
            </UI.Popover>
          </UI.Segment>
          <Input
            onOpen={() => (layoutStore.explorerOpen = true)}
            onClose={() => (layoutStore.explorerOpen = false)}
          />
        </bar>
        <rest $$row>
          <UI.SlotFill.Slot name="actions">
            {items => {
              return (
                <actions>
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
                </actions>
              )
            }}
          </UI.SlotFill.Slot>
        </rest>
      </explorerbar>
    )
  }

  static style = {
    explorerbar: {
      overflow: 'hidden',
      // background: [255, 255, 255, 0.1],
      zIndex: 500,
      padding: [0, 10],
      paddingLeft: IS_ELECTRON ? 78 : 10,
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
