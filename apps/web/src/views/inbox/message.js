import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { messages } from './fakeData'

import timeAgo from 'time-ago'

const { ago } = timeAgo()

@view
export default class Message {
  render({ doc, embed }) {
    const fakeMsg = messages[0]

    return (
      <message $embed={embed}>
        <top $$row>
          <UI.Title size={0.9}>
            <b>
              {fakeMsg.name}
            </b>
          </UI.Title>
          <time>
            {ago(doc.createdAt)}
          </time>
        </top>
        <doc>
          <DocumentView if={!embed} readOnly noTitle document={doc} />
          <fake if={embed}>
            {fakeMsg.message}
          </fake>
        </doc>
      </message>
    )
  }

  static style = {
    message: {
      padding: [20, 18],
      borderTop: [1, '#eee'],
    },
    embed: {},
    top: {
      justifyContent: 'space-between',
    },
    reactions: {
      justifyContent: 'space-between',
      width: 100,
      opacity: 0.5,
      fontSize: 16,
    },
    time: {
      color: '#666',
      fontSize: 13,
    },
    status: {
      justifyContent: 'center',
      opacity: 0.7,
    },
    // leaves room for left bar
    doc: {
      marginLeft: -10,
    },
    fake: {
      color: '#333',
      padding: [5, 20],
      lineHeight: 1.2,
    },
    b: {
      marginLeft: 4,
      marginRight: 4,
    },
    actions: {
      justifyContent: 'space-between',
    },
    buttons: {
      width: 150,
      justifyContent: 'space-between',
    },
    discard: {
      opacity: 0.6,
    },
    p: {
      lineHeight: 1.4,
      padding: 5,
      margin: [5, 0],
      color: '#333',
      border: '0px solid black',
      width: '100%',
      fontSize: 13,
    },
  }
}
