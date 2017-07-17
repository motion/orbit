// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Gemstone from '~/views/gemstone'
import { User } from '@mcro/models'

@view({
  store: @view.attach('explorerStore')
  class {
    value = ''

    submit = () => {
      console.log('submit', this.value)
      // User.org.inviteMember(this.value)
    }
  },
})
export default class DocPageActions {
  render({ store, explorerStore }) {
    const { document } = explorerStore

    if (!document || document === null) {
      return null
    }

    const popoverProps = {
      elevation: 3,
      borderRadius: 8,
      background: 'transparent',
      distance: 10,
      forgiveness: 16,
      towards: 'left',
      delay: 150,
      openOnHover: true,
      closeOnClick: true,
    }

    return (
      <actions
        $$draggable
        css={{
          flexFlow: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 15,
          marginLeft: -35,
          alignSelf: 'flex-end',
        }}
      >
        <UI.Popover
          {...popoverProps}
          target={
            <UI.Button chromeless circular padding={0} size={1.2} glow>
              <Gemstone
                if={explorerStore && explorerStore.document}
                id={explorerStore.document.id}
                size={28}
                css={{
                  margin: 'auto',
                }}
              />
            </UI.Button>
          }
        >
          <UI.Popover
            {...popoverProps}
            target={
              <div>
                <top $$row>
                  <left>Updated 2m ago</left>

                  <UI.Button
                    borderWidth={0}
                    icon="fav3"
                    tooltip={document.hasStar ? 'Remove bookmark' : 'Bookmark'}
                    tooltipProps={{
                      towards: 'right',
                    }}
                    highlight={document.hasStar}
                    iconSize={document.hasStar ? 20 : null}
                    onClick={() => document.toggleStar()}
                    width={36}
                    padding={0}
                    iconProps={{
                      css: {
                        transition: 'transform ease-in 80ms',
                        scale: document.hasStar ? 1.1 : 1,
                      },
                    }}
                  />
                </top>

                <UI.Form onSubmit={store.submit}>
                  <UI.Title>Invite:</UI.Title>
                  <UI.Input
                    name="email"
                    type="email"
                    placeholder="my@friend.com"
                    onChange={e => store.ref('value').set(e.target.value)}
                    onEnter={store.submit}
                  />
                  <row $$row $$justify="flex-end">
                    <UI.Button type="submit" icon="3send" />
                  </row>
                </UI.Form>
              </div>
            }
          >
            <UI.List
              width={150}
              padding={3}
              itemProps={{
                height: 32,
                fontSize: 14,
                borderWidth: 0,
                borderRadius: 8,
              }}
            >
              <UI.List.Item icon="gear" primary="Settings" />
              <UI.List.Item
                icon="link"
                primary={<UI.Input value={Router.path} />}
              />
              <UI.List.Item icon="bell" primary="Ping +3" />
            </UI.List>
          </UI.Popover>
        </UI.Popover>
      </actions>
    )
  }
}
