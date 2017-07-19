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

    Router.path // trigger change

    return (
      <inbox>
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
          virtualized={{
            rowHeight: 115,
            overscanRowCount: 5,
          }}
          itemProps={{
            height: 'auto',
            padding: [10, 15, 10, 16],
            overflow: 'hidden',
          }}
          items={store.threads || []}
          getItem={(item, index) => {
            const active = Router.path === item.url()
            return {
              primary: (
                <head $$row $$centered $$justify="space-between" $$flex>
                  {item.title}

                  <date $$row $$justify="flex-end">
                    <UI.Badge if={index % 3} {...badgeProps} color="red">
                      Enhancement
                    </UI.Badge>
                    <UI.Badge if={index % 2} {...badgeProps} color="yellow">
                      Needs help
                    </UI.Badge>
                    <UI.Badge>+2</UI.Badge>
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
                  {item.text ||
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. '}
                </UI.Text>
              ),
              ellipse: false,
              glow: false,
              hoverBackground: !active && [255, 255, 255, 0.025],
              //icon: item.icon,
              onClick: () => Router.go(item.url()),
              onMouseEnter: () => (store.highlightIndex = index),
              active,
            }
          }}
        />
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 0,
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
    },
  }
}
