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
  threads = () => {
    return Thread.find({
      parentId: this.inbox ? this.inbox.id : undefined,
    })
  }

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
              rowHeight: 112,
              overscanRowCount: 5,
            }}
            itemProps={{
              height: 112,
              padding: [12, 15],
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
                borderColor: [0, 0, 0, 0.1],
                borderBottom: [1, [0, 0, 0, 0.1]],
                primary: (
                  <head
                    css={{
                      flex: 1,
                      color: '#ddd',
                      flexFlow: 'row',
                      justify: 'space-between',
                      fontWeight: 400,
                    }}
                  >
                    {item.title}
                  </head>
                ),
                secondary:
                  item.status ||
                  <status
                    $$row
                    $$align="center"
                    $$justify="space-between"
                    $$margin={[2, 0]}
                  >
                    <UI.Text size={0.9} color={[255, 255, 255, 0.7]}>
                      <strong>Nate</strong> {ago(item.createdAt)}
                    </UI.Text>

                    <date css={{ flexFlow: 'row', maxWidth: '50%' }}>
                      {item.tags().map(tag =>
                        <UI.Badge key={tag} {...badgeProps} color="#efefef">
                          {tag}
                        </UI.Badge>
                      )}
                    </date>
                  </status>,
                children: (
                  <UI.Text color={[255, 255, 255, 0.4]} lineHeight="1.25rem">
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
