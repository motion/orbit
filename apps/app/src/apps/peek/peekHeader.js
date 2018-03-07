// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import ControlButton from '~/views/controlButton'

@view
export default class PeekHeader {
  render({ store }) {
    return (
      <header $$draggable>
        <buttons $$row if={store.isTorn} css={{ marginRight: 14 }}>
          <ControlButton icon="x" store={store} />
          <ControlButton icon="y" store={store} background="#F6BE4F" />
          <ControlButton icon="z" store={store} background="#62C554" />
        </buttons>
        <title>
          <UI.Row
            $controls
            $$undraggable
            itemProps={{
              sizeIcon: 1,
              sizePadding: 1.8,
              sizeHeight: 0.75,
              sizeRadius: 0.6,
              borderWidth: 0,
              color: [0, 0, 0, 0.5],
              boxShadow: [
                'inset 0 0.5px 0 0px #fff',
                '0 0.25px 0.5px 0px rgba(0,0,0,0.35)',
              ],
              background: 'linear-gradient(#FDFDFD, #F1F1F1)',
              hover: {
                background: 'linear-gradient(#FDFDFD, #F1F1F1)',
              },
            }}
          >
            <UI.Button
              if={false}
              icon="pin"
              onClick={store.ref('isPinned').toggle}
              highlight={store.isTorn || store.isPinned}
            />
          </UI.Row>
        </title>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [10, 10],
    },
    title: {
      flex: 1,
    },
    controls: {
      padding: [0, 0, 0, 10],
    },
    orbitInput: {
      width: '100%',
      // background: 'red',
    },
  }
}
