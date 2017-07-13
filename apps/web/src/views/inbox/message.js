import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { random } from 'lodash'

@view
export default class Message {
  render({ doc, name }) {
    return (
      <draft>
        <top $$row>
          <UI.Title size={0.9}>
            <b>Nick Cammarata</b>
          </UI.Title>
          <time>
            June {random(1, 25)}
          </time>
        </top>
        <doc>
          <DocumentView readOnly document={doc} />
        </doc>
      </draft>
    )
  }

  static style = {
    draft: {
      padding: [10, 18],
      border: '1px solid #efefef',
      borderRadius: 5,
      marginTop: 10,
      boxShadow: '0px 1px 0px #eee',
    },
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
