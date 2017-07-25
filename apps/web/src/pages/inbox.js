// @flow
import React from 'react'
import * as UI from '@mcro/ui'
import { view, watch } from '@mcro/black'
import Page from './page'
import { Thread } from '~/app'
import Router from '~/router'
import timeAgo from 'time-ago'

const { ago } = timeAgo()

class InboxPageStore {
  get inbox() {
    return this.props.rootStore.document
  }

  @watch
  threads = () =>
    Thread.find({
      parentId: this.inbox ? this.inbox.id : undefined,
    })
}

@view.attach('rootStore')
@view({
  store: InboxPageStore,
})
export default class InboxPage {
  render({ store: { inbox, threads } }) {
    if (!inbox) {
      return null
    }

    return (
      <Page>
        <content>
          <heading>
            <title $$row $$spaceBetween>
              <UI.Title size={2}>
                {inbox.title}
              </UI.Title>

              <UI.Button
                onClick={() => Router.go(Router.path + '/draft')}
                theme="green"
                color="#fff"
                icon="add"
                iconAfter
              >
                Create New
              </UI.Button>
            </title>

            <filterbar $$row $$spaceBetween>
              <begin $$row $$centered>
                <UI.Checkbox margin={[0, 10, 0, 5]} />
                <UI.Segment>
                  <UI.Button highlight icon="book-open">
                    6 Open
                  </UI.Button>
                  <UI.Button icon="check">36 Closed</UI.Button>
                </UI.Segment>
              </begin>

              <UI.Segment>
                <UI.Dropdown>Author</UI.Dropdown>
                <UI.Dropdown>Labels</UI.Dropdown>
                <UI.Dropdown>Assignee</UI.Dropdown>
                <UI.Dropdown>Sort</UI.Dropdown>
              </UI.Segment>
            </filterbar>
          </heading>

          <threads>
            <list>
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
                items={threads}
                // setTimeout speeds up navigation
                onSelect={item => this.setTimeout(() => Router.go(item.url()))}
                isSelected={item => item.url() === Router.path}
                getItem={item => {
                  return {
                    glow: false,
                    before: <UI.Checkbox />,
                    primary: (
                      <head $$row $$centered $$justify="space-between" $$flex>
                        <UI.Title size={1.2}>
                          {item.title}
                        </UI.Title>

                        <date $$row $$justify="flex-end">
                          {item.tags().map(tag =>
                            <UI.Badge color="#efefef">
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
                        {item.text && item.text.slice(0, 100)}
                      </UI.Text>
                    ),
                  }
                }}
              />
            </list>
          </threads>
        </content>
      </Page>
    )
  }

  static style = {
    content: {
      padding: [10, 0],
    },
    heading: {
      padding: [0, 30, 10],
      borderBottom: [1, '#eee'],
    },
    title: {
      marginBottom: 10,
    },
    threads: {
      padding: [10, 10],
    },
    filterbar: {
      margin: [0, -10],
      padding: [4, 5],
      // borderRadius: 12,
    },
    list: {
      margin: [10, 0],
    },
  }
}
