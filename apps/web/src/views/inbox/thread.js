import { view, watch } from '@mcro/black'
import { Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import Message from './message'
import { sortBy } from 'lodash'
import RightArrow from '~/views/rightArrow'

class ThreadStore {
  docs = Document.forThread(this.props.inboxStore.activeItem._id)
}

@view.attach('explorerStore')
@view({
  store: ThreadStore,
})
export default class Thread {
  render({ explorerStore, inboxStore, store }) {
    const { activeItem: item } = inboxStore
    const { docs } = store
    const sorted = sortBy(docs || [], 'createdAt')

    return (
      <thread>
        <bar>
          <UI.Button
            chromeless
            glow={false}
            spaced
            size={1.2}
            icon={'arrow-min-left'}
            onClick={() => (inboxStore.activeItem = null)}
            color={[0, 0, 0, 0.2]}
            hoverColor={[0, 0, 0, 0.6]}
            margin={[0, 0, 0, -5]}
          />

          <title $$row>
            {explorerStore.document.title}{' '}
            <RightArrow css={{ opacity: 0.2, margin: [0, 8] }} /> {item.title}
          </title>
          <UI.Button
            glow={false}
            chromeless
            size={1.2}
            icon="fav31"
            color={[0, 0, 0, 0.4]}
            hoverColor={[0, 0, 0, 0.6]}
          />
          <actions />
        </bar>
        <content>
          {sorted.map(doc => <Message doc={doc} />)}
        </content>
      </thread>
    )
  }

  static style = {
    // so it scrolls nicely
    thread: {
      paddingBottom: 30,
    },
    glow: {
      pointerEvents: 'none',
    },
    bar: {
      position: 'sticky',
      zIndex: 1000,
      top: 0,
      left: -20,
      borderBottom: '1px solid #ddd',
      boxShadow: ['0 0 5px rgba(0,0,0,0.15)'],
      overflow: 'hidden',
    },
    title: {
      flex: 5,
      color: '#444',
      fontWeight: 300,
      fontSize: 16,
      lineHeight: '1.4rem',
    },
    content: {
      padding: 20,
    },
  }
}
