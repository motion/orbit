import * as Constants from '~/constants'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class OraDrawer {
  render({ oraStore }) {
    const { crawlState, crawlStatus } = oraStore
    return (
      <UI.Theme name="dark">
        <UI.Drawer
          open={crawlState}
          from="bottom"
          background="#222"
          boxShadow="0 0 100px #000"
          size={120}
        >
          <title>
            <UI.Title fontWeight={600} size={1}>
              Crawl Status
            </UI.Title>
            <UI.Button
              chromeless
              icon="remove"
              opacity={0.8}
              size={0.9}
              css={{ position: 'absolute', top: 10, right: 10 }}
              onClick={oraStore.stopCrawl}
            />
          </title>
          <contents>
            <status if={crawlStatus}>
              <UI.Text>Crawled: {crawlStatus.count}</UI.Text>
            </status>
            <info if={crawlState}>
              <UI.Text>entry: {crawlState.entry}</UI.Text>
            </info>
          </contents>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    contents: {
      padding: 10,
      paddingBottom: Constants.ACTION_BAR_HEIGHT + 10,
      flex: 1,
      overflowY: 'scroll',
    },
    title: {
      background: [0, 0, 0, 0.05],
      padding: 7,
      flexFlow: 'row',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
    },
  }
}
