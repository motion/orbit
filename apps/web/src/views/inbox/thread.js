import { view, watch } from '@mcro/black'
import { Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import { random } from 'lodash'
import Message from './message'
import Draft from './draft'
import { sortBy } from 'lodash'
import FakeData from './fakeData'

const GLOW_PROPS = {
  color: 'salmon',
  scale: 1.6,
  offsetLeft: -200,
  resist: 70,
  opacity: 0.048,
}

class ThreadStore {
  docs = Document.forThread(this.props.inboxStore.activeItem._id)
}

@view({
  store: ThreadStore,
})
export default class Thread {
  render({ inboxStore, store }) {
    const { activeItem: item } = inboxStore
    const { docs } = store
    const sorted = sortBy(docs || [], 'createdAt')

    return (
      <thread>
        <bar>
          <barblur>
            <UI.Glow $glow {...GLOW_PROPS} show />
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

            <title>
              {item.title}
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
          </barblur>
        </bar>
        <content>
          {sorted.map(doc => <Message doc={doc} />)}
          <Draft inboxStore={inboxStore} />
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
    barblur: {
      margin: -20,
      padding: 30,
      backdropFilter: 'blur(10px)',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexFlow: 'row',
      // boxShadow: ['inset 0 0 100px rgba(240,240,255, 1)'],
      background: 'rgba(255, 255,255, 0.9)',
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
