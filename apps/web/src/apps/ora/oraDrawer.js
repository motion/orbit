import * as Constants from '~/constants'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class CrawlDrawerStore {
    shown = true
  },
})
export default class OraDrawer {
  render({ store, oraStore }) {
    const { crawlState, crawlStatus } = oraStore
    return (
      <UI.Theme name="dark">
        <UI.Drawer
          open={crawlState}
          from="bottom"
          background="#222"
          boxShadow="0 0 100px #000"
          size={store.shown ? 140 : 82}
        >
          <container if={crawlStatus && crawlState}>
            <title>
              <UI.Progress.Circle
                css={{ marginRight: 10 }}
                lineColor="green"
                percent={crawlStatus.count / crawlState.maxPages * 100}
                size={18}
              />
              <UI.Title fontWeight={600} size={1}>
                Crawling ({crawlStatus.count} of {crawlState.maxPages})
              </UI.Title>
              <UI.Button
                chromeless
                icon={store.shown ? 'arrow-min-down' : 'arrow-min-up'}
                opacity={0.8}
                size={0.9}
                css={{ position: 'absolute', top: 5, right: 7 }}
                onClick={store.ref('shown').toggle}
              />
            </title>
            <content>
              <UI.Text opacity={0.5} ellipse css={{ marginRight: 10 }}>
                Entry: {crawlState.entry}
                <br />
                Attempted URLs: 0
              </UI.Text>
              <after css={{ flex: 0.5 }}>
                <UI.Button onClick={oraStore.stopCrawl}>Cancel</UI.Button>
              </after>
            </content>
          </container>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    content: {
      padding: 10,
      paddingBottom: Constants.ACTION_BAR_HEIGHT + 10,
      flex: 1,
      flexFlow: 'row',
      maxWidth: '100%',
      overflow: 'hidden',
      overflowY: 'scroll',
    },
    row: {
      flexFlow: 'row',
      flex: 1,
      overflow: 'hidden',
    },
    title: {
      background: [0, 0, 0, 0.05],
      padding: [5, 7],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
    },
    status: {
      flex: 0,
      width: '80%',
    },
  }
}
