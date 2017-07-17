import { view } from '@mcro/black'
import { Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import Message from './message'
import { sortBy } from 'lodash'
import Draft from './draft'

class ThreadStore {
  docs = Document.forThread(this.props.document.id)
  showReply = false
}

@view.attach('explorerStore')
@view({
  store: ThreadStore,
})
export default class Thread {
  render({ store, document }) {
    const { docs } = store
    const sorted = sortBy(docs || [], 'createdAt')

    return (
      <thread>
        {sorted.map(doc => <Message doc={doc} />)}

        <reply>
          <UI.Button
            if={!store.showReply}
            onClick={store.ref('showReply').toggle}
          >
            Add reply
          </UI.Button>
          <container $show={store.showReply}>
            <UI.Title>Response</UI.Title>
            <Draft $draft isReply document={document} />
          </container>
        </reply>
      </thread>
    )
  }

  static style = {
    thread: {
      flex: 1,
    },
    reply: {
      borderTop: [1, '#eee'],
      padding: [20, 20],
    },
    draft: {
      margin: [0, -15],
    },
    container: {
      display: 'none',
      overflow: 'hidden',
      transition: 'all ease-in 150ms',
    },
    show: {
      display: 'flex',
    },
  }
}
