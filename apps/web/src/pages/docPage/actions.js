// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Gemstone from '~/views/gemstone'

@view.attach('explorerStore')
@view
export default class DocPageActions {
  render({ explorerStore }) {
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
            <UI.Button
              size={1.5}
              opacity={0.5}
              chromeless
              css={{ textAlign: 'right' }}
            >
              <wrap>
                <UI.Text size={1}>Share</UI.Text>
                <UI.Text size={0.8} color={[0, 0, 0, 0.5]}>
                  +3 people
                </UI.Text>
              </wrap>
            </UI.Button>
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

        <UI.Button
          size={1.25}
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
        <Gemstone
          if={false && explorerStore && explorerStore.document}
          id={explorerStore.document.id}
          size={20}
          css={{
            margin: 'auto',
            marginLeft: 10,
          }}
        />
      </actions>
    )
  }
}
