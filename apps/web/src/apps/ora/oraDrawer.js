import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Drawer from '~/views/drawer'

@view({
  store: class CrawlDrawerStore {
    statusShown = true
    resultsShown = true
  },
})
export default class OraDrawer {
  render({ store, oraStore }) {
    const { crawler } = oraStore
    const statusOpen = !crawler.results && crawler.isRunning && crawler.status

    return (
      <drawers>
        <Drawer
          open={crawler.results}
          collapsable
          collapsed={!store.resultsShown}
          onCollapse={store.ref('resultsShown').toggle}
          renderTitle={() => `Crawl Results (${crawler.results.length})`}
          size={300}
        >
          <content $$flex if={crawler.results}>
            <UI.List
              items={crawler.results}
              getItem={({ contents }) => ({
                primary: contents.title,
                children: contents.body,
                childrenEllipse: 2,
              })}
            />
          </content>
        </Drawer>

        <Drawer
          open={statusOpen}
          collapsable
          collapsed={!store.statusShown}
          onCollapse={store.ref('statusShown').toggle}
          renderTitle={() =>
            `Crawling (${crawler.status.count} of ${crawler.settings.maxPages})`
          }
          renderProgress={() =>
            crawler.status.count / crawler.settings.maxPages * 100
          }
          size={150}
        >
          <content $$flex if={crawler.status}>
            <UI.Text opacity={0.5} ellipse css={{ marginRight: 10 }}>
              Entry: {crawler.status.entry}
              <br />
              Attempted URLs: 0
            </UI.Text>
            <after css={{ flex: 0.5 }}>
              <UI.Button onClick={oraStore.stopCrawl}>Cancel</UI.Button>
            </after>
          </content>
        </Drawer>
      </drawers>
    )
  }
}
