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
      draft: { $ne: true },
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
              <UI.Title size={2.2}>
                {inbox.title}
              </UI.Title>
            </title>

            <filterbar $$row $$spaceBetween>
              <begin $$row $$centered>
                <UI.Checkbox opacity={0.5} margin={[0, 10, 0, 5]} />
                <UI.Row>
                  <UI.Button chromeless inline icon="book-open">
                    6 Open
                  </UI.Button>
                  <UI.Button chromeless opacity={0.5} inline icon="check">
                    36 Done
                  </UI.Button>
                </UI.Row>
              </begin>

              <end $$row $$centered>
                <UI.Row>
                  <UI.Dropdown>Filter</UI.Dropdown>
                  <UI.Dropdown>Sort</UI.Dropdown>
                </UI.Row>

                <UI.Button
                  circular
                  onClick={() => Router.go(Router.path + '/draft')}
                  icon="simple-add"
                  iconAfter
                  size={1.25}
                  tooltip="Create new"
                  tooltipProps={{
                    towards: 'top',
                  }}
                  margin={[-20, 0, -20, 10]}
                />
              </end>
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
                    before: (
                      <before css={{ marginRight: 10 }}>
                        <UI.Checkbox />
                      </before>
                    ),
                    primary: (
                      <head $$row $$centered $$justify="space-between" $$flex>
                        <UI.Title size={1.2}>
                          {item.title}
                        </UI.Title>

                        <date $$row $$justify="flex-end">
                          {item.tags().map(tag =>
                            <UI.Badge key={tag} color="#efefef">
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
      marginTop: 5,
      marginBottom: 10,
    },
    threads: {
      padding: [0, 10],
    },
    filterbar: {
      margin: [0, -11],
      padding: [4, 5],
      // borderRadius: 12,
    },
    list: {
      margin: [10, 0],
    },
  }
}
