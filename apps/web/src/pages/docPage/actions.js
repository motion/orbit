// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Gemstone from '~/views/gemstone'
import Router from '~/router'
import { User } from '@mcro/models'

@view.attach('explorerStore')
@view
export default class DocPageActions {
  render({ explorerStore }) {
    const { document } = explorerStore

    if (!document || document === null) {
      return null
    }

    const popoverProps = {
      elevation: 1,
      borderRadius: 8,
      background: 'transparent',
      distance: 10,
      forgiveness: 16,
      towards: 'left',
      adjust: [0, 70],
      delay: 50,
      openOnHover: true,
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
          pointerEvents: 'auto',
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
          <UI.Surface width={200} padding={10}>
            <top $$row>
              <left css={{ flex: 1 }}>
                <UI.Text size={0.9}>
                  <strong>Updated</strong> 2m ago
                </UI.Text>
                <UI.Text size={0.9}>
                  <strong>Viewed</strong> 1m ago
                </UI.Text>
              </left>

              <UI.Button
                size={1.5}
                borderWidth={0}
                icon="fav3"
                tooltip={document.hasStar ? 'Remove bookmark' : 'Bookmark'}
                tooltipProps={{
                  towards: 'top',
                }}
                highlight={document.hasStar}
                iconSize={document.hasStar ? 20 : null}
                onClick={() => document.toggleStar()}
                iconProps={{
                  css: {
                    transition: 'transform ease-in 80ms',
                    scale: document.hasStar ? 1.1 : 1,
                  },
                }}
              />
            </top>

            <space css={{ height: 8 }} />

            <UI.List.Item if={false} icon="back" primary="Revisions" />

            <UI.Form onSubmit={User.org && User.org.inviteMember}>
              <UI.Title>Invite:</UI.Title>
              <UI.Segment>
                <UI.Input
                  name="email"
                  type="email"
                  placeholder="my@friend.com"
                />
                <UI.Input type="submit" icon="3send" />
              </UI.Segment>
            </UI.Form>

            <space css={{ height: 8 }} />

            <UI.Title>Share link</UI.Title>
            <UI.Input value={Router.path} />
          </UI.Surface>
        </UI.Popover>
      </actions>
    )
  }
}
