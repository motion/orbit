// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Gemstone from '~/views/gemstone'

@view.attach('explorerStore')
@view
export default class DocPageActions {
  render({ explorerStore }) {
    const document = explorerStore.document

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
      <actions $$draggable css={{ flexFlow: 'row' }}>
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
                <UI.Text size={0.8}>+3 people</UI.Text>
                <UI.Text size={0.8} color={[0, 0, 0, 0.5]}>
                  Jan 3rd
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
            <UI.Popover
              {...popoverProps}
              target={<UI.List.Item icon="bell" primary="Ping +3" />}
              towards="left"
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
                <UI.List.Item icon="all" primary="All" color="black" />
                <UI.List.Item icon="girl" primary="Jamie S." />
                <UI.List.Item icon="boy" primary="Angela M." />
                <UI.List.Item icon="boy" primary="Theresa M." />
              </UI.List>
            </UI.Popover>
          </UI.List>
        </UI.Popover>

        <Gemstone
          if={explorerStore && explorerStore.document}
          document={explorerStore.document}
          size={20}
          css={{
            margin: 'auto',
          }}
        />
      </actions>
    )
  }

  static style = {
    actions: {
      alignItems: 'flex-end',
      padding: [10, 0],
    },
  }
}
