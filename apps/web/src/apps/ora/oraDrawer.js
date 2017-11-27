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

    return (
      <drawers>
        <Drawer
          open={crawler.isRunning || crawler.isFinished}
          collapsable
          collapsed={!store.resultsShown}
          onCollapse={store.ref('resultsShown').toggle}
          renderTitle={() =>
            crawler.isFinished
              ? `Crawl done!`
              : `Crawling... (${crawler.results ? crawler.results.length : 0})`
          }
          renderProgress={() =>
            crawler.status
              ? crawler.status.count / crawler.settings.maxPages * 100
              : 0
          }
          size={300}
          after={
            <UI.Row
              if={crawler.results}
              spaced
              items={[
                {
                  icon: 'remove',
                  children: 'Cancel',
                  onClick: oraStore.crawler.stop,
                  theme: 'darkred',
                },
                {
                  flex: true,
                },
                {
                  icon: 'check',
                  children: 'Save',
                  onClick: oraStore.commitResults,
                  theme: 'green',
                },
              ]}
            />
          }
        >
          <inner css={{ paddingBottom: 50, width: '100%' }} if={crawler.status}>
            <UI.Text if={!crawler.isFinished} opacity={0.5} margin={[0, 0, 10]}>
              Crawler active. Finding up to {crawler.settings.maxPages} pages:
            </UI.Text>
            <UI.Text
              if={crawler.isFinished && crawler.results}
              opacity={0.5}
              margin={[0, 0, 10]}
            >
              Finished crawl, found {crawler.results.length} pages:
            </UI.Text>
            <UI.List
              if={crawler.results}
              virtualized={{
                measure: true,
              }}
              itemKey={crawler.results.length}
              items={crawler.results || []}
              getItem={({ contents }) => ({
                primary: contents.title,
                children: contents.body,
                childrenEllipse: 2,
              })}
            />
          </inner>
        </Drawer>
      </drawers>
    )
  }
}
