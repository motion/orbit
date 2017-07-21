import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import timeAgo from 'time-ago'
import Draft from './draft'
import Router from '~/router'
import { Thread } from '~/app'
import fuzzy from 'fuzzy'

const { ago } = timeAgo()

class InboxStore {
  document = this.props.document
  threads = Thread.find({
    parentId: this.document ? this.document.id : undefined,
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

@view.attach('explorerStore')
@view({
  store: InboxStore,
})
export default class Inbox {
  render({ store, large }) {
    const badgeProps = {}

    Router.path // trigger change

    return (
      <inbox>
        <bar if={large && store.document}>
          <bartitle $$flex>
            <UI.Title size={3}>{store.document.title}</UI.Title>
            {(store.threads || []).length} new
          </bartitle>
          <actions>
            <UI.Popover
              openOnClick
              closeOnEscape
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
              <Draft inboxStore={store} />
            </UI.Popover>
          </actions>
        </bar>
        <content>
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
            }}
            items={store.filteredThreads}
            // setTimeout speeds up navigation
            onSelect={item => this.setTimeout(() => Router.go(item.url()))}
            isSelected={item => item.url() === Router.path}
            getItem={(item, index) => {
              return {
                glow: false,
                primary: (
                  <head $$row $$centered $$justify="space-between" $$flex>
                    {item.title}

                    <date $$row $$justify="flex-end">
                      {item.tags.map(tag =>
                        <UI.Badge {...badgeProps} color="#efefef">
                          {tag}
                        </UI.Badge>
                      )}
                    </date>
                  </head>
                ),
                secondary:
                  item.status ||
                  <status $$row $$align="center">
                    <UI.Text size={0.9}>
                      <strong>Nate</strong> replied {ago(item.createdAt)}
                    </UI.Text>
                  </status>,
                children: (
                  <UI.Text>
                    {(item.text && item.text.slice(0, 100)) ||
                      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. '}
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
    create: {
      width: 400,
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
    title: {
      fontWeight: 'bold',
      lineHeight: 100,
    },
    all: {
      marginTop: 15,
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
