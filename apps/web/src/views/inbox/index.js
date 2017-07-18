import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Thread } from '@mcro/models'
import timeAgo from 'time-ago'
import Draft from './draft'
import Router from '~/router'

const { ago } = timeAgo()

const glowProps = {
  color: '#000',
  scale: 1.6,
  offsetTop: 100,
  resist: 70,
  opacity: 0.048,
}

class InboxStore {
  document = this.props.document
  threads = Thread.forDoc(this.document && this.document.id)
  highlightIndex = 0
  activeItem = null
}

@view.attach('explorerStore')
@view({
  store: InboxStore,
})
export default class Inbox {
  render({ store, hideTitle }) {
    // subscribe to variable
    store.highlightIndex

    const badgeProps = {}

    return (
      <inbox>
        <content>
          <bar if={!hideTitle}>
            <UI.Title size={1} stat={`${(store.threads || []).length} new`}>
              Threads
            </UI.Title>
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

          <UI.List
            background="transparent"
            $list
            itemProps={{ height: 'auto', padding: [10, 15, 10, 16] }}
            items={store.threads || []}
            getItem={(item, index) => ({
              primary: (
                <head $$row $$centered $$justify="space-between" $$flex>
                  {item.title}

                  <date $$row $$justify="flex-end">
                    <UI.Badge
                      if={Math.random() > 0.2}
                      {...badgeProps}
                      color="red"
                    >
                      Enhancement
                    </UI.Badge>
                    <UI.Badge
                      if={Math.random() > 0.4}
                      {...badgeProps}
                      color="yellow"
                    >
                      Needs help
                    </UI.Badge>
                    <UI.Badge>+2</UI.Badge>
                  </date>
                </head>
              ),
              secondary:
                item.status ||
                <status $$row>
                  <UI.Button chromeless inline margin={[0, -2]}>
                    Nate
                  </UI.Button>{' '}
                  replied {ago(item.createdAt)}
                </status>,
              children: (
                <UI.Text>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Ullam provident minus...
                </UI.Text>
              ),
              ellipse: false,
              glowProps,
              //icon: item.icon,
              onClick: () => Router.go(item.url()),
              onMouseEnter: () => (store.highlightIndex = index),
              $highlight: store.highlightIndex === index,
              css: {
                borderBottom: [1, [0, 0, 0, 0.1]],
              },
            })}
          />
        </content>
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 0,
      position: 'relative',
      width: '100%',
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
    list: {
      margin: [0, -20],
    },
    title: {
      fontWeight: 'bold',
      lineHeight: 100,
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
