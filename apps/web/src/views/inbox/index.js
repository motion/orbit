import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { Thread, Document } from '@mcro/models'
import ThreadView from './thread'
import timeAgo from 'time-ago'
import Draft from './draft'

const { ago } = timeAgo()

const GLOW_PROPS = {
  color: 'salmon',
  scale: 1.6,
  offsetLeft: -200,
  resist: 70,
  opacity: 0.048,
}

class InboxStore {
  threads = Thread.forDoc(this.props.document && this.props.document.id)
  highlightIndex = 0
  activeIndex = null
  newThreadTitle = ''
  draft = null
  draftThread = null
  activeItem = null

  createDraft = async () => {
    const { document } = this.props

    if (!document) {
      console.error('no doc')
      return
    }

    this.draftThread = await Thread.create({
      draft: true,
      title: this.newThreadTitle,
      docId: document.id,
    })
    this.draft = await Document.create({
      draft: true,
      title: '',
      threadId: this.draftThread.id,
    })
  }

  discardDraft = () => {
    console.log('discarding')
    this.draftThread = null
    this.draft = null
  }

  saveDraft = async () => {
    this.draft.draft = false
    await this.draft.save()
    this.draftThread.title = this.draft.title
    this.draftThread.draft = false
    await this.draftThread.save()
    this.activeItem = this.draftThread
    this.draftThread = null
    this.draft = null
  }

  start() {
    /*
    const { explorerStore } = this.props

    this.on(explorerStore, 'action', (name: string) => {
      if (name === 'up' && this.highlightIndex > 0) {
        this.highlightIndex--
      }

      if (name === 'down') {
        this.highlightIndex++
      }

      if (name === 'enter') {
        this.activeIndex = this.highlightIndex
      }

      if (name === 'esc') {
        this.activeIndex = null
      }
    })
    */
  }
}

@view.attach('explorerStore')
@view({
  store: InboxStore,
})
export default class Inbox {
  render({ store }) {
    // subscribe to variable
    store.highlightIndex

    return (
      <inbox>
        <content if={!store.activeItem}>
          <bar>
            <UI.Title size={1} stat={`${(store.threads || []).length} new`}>
              Threads
            </UI.Title>
            <actions>
              <UI.Popover
                openOnClick
                closeOnEscape
                background
                width={480}
                borderRadius={8}
                elevation={2}
                target={
                  <UI.Button
                    if={!store.draft}
                    css={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}
                    icon="siadd"
                    circular
                    size={1.4}
                    chromeless
                    onClick={store.createDraft}
                  />
                }
              >
                <Draft inboxStore={store} />
              </UI.Popover>
            </actions>
          </bar>

          <draft if={store.draft && store.draft._id}>
            <DocumentView document={store.draft} />
            <buttons $$row>
              <UI.Button onClick={store.discardDraft} $discard chromeless>
                Discard
              </UI.Button>
              <UI.Button
                width={70}
                icon="send"
                chromeless
                onClick={store.saveDraft}
              >
                Post
              </UI.Button>
            </buttons>
          </draft>

          <UI.List
            background="transparent"
            $list
            itemProps={{ paddingLeft: 20, height: 'auto', padding: 15 }}
            items={store.threads || []}
            getItem={(item, index) => ({
              primary: item.title,
              secondary: item.status,
              date: ago(item.createdAt),
              ellipse: false,
              glowProps: GLOW_PROPS,
              //icon: item.icon,
              paddingRight: 80,
              onClick: () => (store.activeItem = item),
              onMouseEnter: () => (store.highlightIndex = index),
              $highlight: store.highlightIndex === index,
            })}
          />
        </content>

        <ThreadView if={store.activeItem} inboxStore={store} />
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 0,
      position: 'relative',
      width: '100%',
    },
    list: {
      marginLeft: -20,
      marginRight: -20,
    },
    create: {
      width: 400,
    },
    title: {
      fontWeight: 'bold',
    },
    item: {
      padding: 10,
      paddingLeft: 20,
      height: 40,
    },
    highlight: {
      background: '#eee',
      borderLeft: '3px solid #999',
    },
    draft: {
      padding: [10, 18, 10, 0],
      border: '1px solid #efefef',
      borderRadius: 5,
      marginTop: 10,
      boxShadow: '0px 1px 0px #eee',
    },
    buttons: {
      justifyContent: 'flex-end',
    },
    discard: {
      opacity: 0.6,
    },
    draftSubmit: {
      width: 60,
    },
    all: {
      marginTop: 15,
    },
    content: {
      padding: 20,
    },
    list: {
      marginLeft: -20,
      marginRight: -(20 + 72),
    },
    title: {
      fontWeight: 'bold',
      lineHeight: 100,
    },
    item: {
      padding: 10,
      paddingLeft: 20,
      height: 40,
    },
    highlight: {
      background: '#eee',
      borderLeft: '3px solid #999',
    },
    all: {
      marginTop: 15,
    },
    bar: {
      flexFlow: 'row',
      marginBottom: 5,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }
}
