import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import timeAgo from 'time-ago'
import Draft from './draft'
import Router from '~/router'
import { Thread } from '~/app'
import fuzzy from 'fuzzy'

const { ago } = timeAgo()

class InboxStore {
  inbox = this.props.document
  @watch
  threads = () =>
    Thread.find({
      parentId: this.inbox ? this.inbox.id : undefined,
    })

  get filteredThreads() {
    if (!this.threads) {
      return []
    }
    if (!this.props.filter) {
      return this.threads
    }
    return fuzzy
      .filter(this.props.filter, this.threads, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
  }
}

@view.attach('rootStore')
@view({
  store: InboxStore,
})
export default class Inbox {
  render({ store, inSidebar, large }) {
    const badgeProps = {}

    Router.path // trigger change

    const { filteredThreads } = store

    return (
      <inbox>
        <bar if={large && store.inbox}>
          <bartitle $$flex>
            <UI.Title size={3}>{store.inbox.title}</UI.Title>
            {(store.threads || []).length} new
          </bartitle>
          <actions>
            <UI.Popover
              openOnClick
              closeOnEsc
              background="#fff"
              width={480}
              borderRadius={8}
              elevation={2}
              target={
                <UI.Button
                  css={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                  }}
                  icon="siadd"
                  circular
                  size={1.4}
                  chromeless
                />
              }
            >
              <Draft parentId={store.inbox && store.inbox.id} />
            </UI.Popover>
          </actions>
        </bar>
        <content if={filteredThreads}>
          <UI.List
            background="transparent"
            controlled
            virtualized={{
              rowHeight: 115,
              overscanRowCount: 5,
            }}
            itemProps={{
              height: 'auto',
              padding: [10, 15, 10, 16],
              overflow: 'hidden',
              highlightBackground: [0, 0, 0, 0.25],
            }}
            items={filteredThreads}
            // setTimeout speeds up navigation
            onSelect={item => this.setTimeout(() => Router.go(item.url()))}
            isSelected={item => item.url() === Router.path}
            getItem={item => {
              return {
                glow: false,
                primary: (
                  <head $$row $$centered $$justify="space-between" $$flex>
                    {item.title}

                    <date $$row $$justify="flex-end">
                      {item.tags().map(tag =>
                        <UI.Badge {...badgeProps} color="#efefef">
                          {tag}
                        </UI.Badge>
                      )}
                    </date>
                  </head>
                ),
                secondary:
                  item.status ||
                  <status if={false} $$row $$align="center">
                    <UI.Text size={0.9}>
                      <strong>Nate</strong> replied {ago(item.createdAt)}
                    </UI.Text>
                  </status>,
                children: (
                  <UI.Text>
                    {item.previewText}
                  </UI.Text>
                ),
              }
            }}
          />
        </content>
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: [0, 20],
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    bar: {
      flexFlow: 'row',
      marginBottom: 5,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: [20, 0],
    },
  }
}
