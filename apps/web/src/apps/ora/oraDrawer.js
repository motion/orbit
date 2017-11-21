import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Drawer from '~/views/drawer'

@view({
  store: class CrawlDrawerStore {
    shown = true
  },
})
export default class OraDrawer {
  render({ store, oraStore }) {
    const { crawlState, crawlStatus, crawlResults } = oraStore
    return (
      <Drawer
        collapsable
        collapsed={!store.shown}
        onCollapse={store.ref('shown').toggle}
        title={`Crawling (${crawlStatus.count} of ${crawlState.maxPages})`}
        open={crawlState}
        progress={crawlStatus.count / crawlState.maxPages * 100}
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
    )
  }
}
