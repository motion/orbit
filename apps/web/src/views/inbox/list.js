import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Thread } from '@mcro/models'
import timeAgo from 'time-ago'
import Draft from './draft'
import Router from '~/router'

const { ago } = timeAgo()

class InboxStore {
  document = this.props.document
  threads = Thread.find({
    parentId: this.document ? this.document.id : undefined,
  })
}

@view.attach('explorerStore')
@view({
  store: InboxStore,
})
export default class Inbox {
  render({ store, hideTitle }) {
    const badgeProps = {}

    Router.path // trigger change

    return (
      <inbox>
        <bar if={!hideTitle}>
          <UI.Title size={3} stat={`${(store.threads || []).length} new`}>
            {store.document.title}
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
        <content>
          <UI.List
            background="transparent"
            $list
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
            items={store.threads || []}
            // setTimeout speeds up navigation
            onSelect={item => this.setTimeout(() => Router.go(item.url()))}
            isSelected={item => item.url() === Router.path}
            getItem={(item, index) => {
              return {
                glow: false,
                primary: (
                  <head $$row $$centered $$justify="space-between" $$flex>
                    <top $$row>
                      <titleText>
                        {item.title}
                      </titleText>
                      {false && '&nbsp;by Nate'}
                      {item.tags.map(tag =>
                        <UI.Badge {...badgeProps}>
                          {tag}
                        </UI.Badge>
                      )}
                    </top>
                    <date $$row $$justify="flex-end">
                      {ago(item.createdAt)}
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
    content: {
      margin: [0, -20],
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
    list: {
      maxWidth: 600,
    },
    draftSubmit: {
      width: 60,
    },
    titleText: {
      fontWeight: 'bold',
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
