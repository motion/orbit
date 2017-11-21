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
    const { crawlState, crawlStatus, crawlResults } = oraStore
    const statusOpen = !crawlResults && crawlState

    console.log('crawlResults', crawlResults)
    return (
      <drawers>
        <Drawer
          collapsable
          collapsed={!store.resultsShown}
          onCollapse={store.ref('resultsShown').toggle}
          renderTitle={() => `Crawl Results ${crawlResults.length})`}
          open={crawlResults}
          size={300}
        >
          <content if={crawlResults}>
            <UI.List
              items={crawlResults}
              getItem={({ contents }) => ({
                primary: contents.title,
                children: contents.body,
              })}
            />
          </content>
        </Drawer>

        <Drawer
          collapsable
          collapsed={!store.statusShown}
          onCollapse={store.ref('statusShown').toggle}
          renderTitle={() =>
            `Crawling (${crawlStatus.count} of ${crawlState.maxPages})`
          }
          renderProgress={() => crawlStatus.count / crawlState.maxPages * 100}
          open={statusOpen}
          size={140}
        >
          <content $$flex if={crawlState}>
            <UI.Text opacity={0.5} ellipse css={{ marginRight: 10 }}>
              Entry: {crawlState.entry}
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
