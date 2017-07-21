import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { messages } from './fakeData'
import Gemstone from '~/views/kit/gemstone'
import timeAgo from 'time-ago'

const { ago } = timeAgo()

@view
export default class Reply {
  render({ doc, embed }) {
    const fakeMsg = messages[0]

    return (
      <message $embed={embed}>
        <doc>
          <DocumentView if={!embed} readOnly noTitle document={doc} />
          <fake if={embed}>
            {fakeMsg.message}
          </fake>
        </doc>
        <meta>
          <metacontents>
            <before>
              <UI.Title size={0.9} color="#000">
                {fakeMsg.name}
              </UI.Title>
              <UI.Text size={0.9} color="#999">
                {ago(doc.createdAt)}
              </UI.Text>
            </before>
            <Gemstone id={fakeMsg.name} marginLeft={10} />
          </metacontents>
        </meta>
      </message>
    )
  }

  static style = {
    message: {
      padding: [25, 20],
      borderTop: [1, '#eee'],
      flexFlow: 'row',
      alignItems: 'flex-start',
      position: 'relative',
    },
    metacontents: {
      textAlign: 'right',
      flexFlow: 'row',
      width: 120,
    },
    // leaves room for left bar
    doc: {
      marginLeft: -25,
      flex: 1,
    },
    fake: {
      color: '#333',
      padding: [5, 20],
      lineHeight: 1.2,
    },
    actions: {
      justifyContent: 'space-between',
    },
  }
}
