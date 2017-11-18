import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { Thing } from '~/app'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import { isEqual } from 'lodash'
import After from '~/views/after'

const clean = str => {
  if (typeof str !== 'string') {
    return 'bad string'
  }
  return str.replace(/[\r\n|\n|\r|\s]+/gm, ' ').trim()
}

export default class ContextSidebar {
  @watch
  isPinned = () => this.osContext && Thing.findOne({ url: this.osContext.url })
  showCrawler = null
  crawlerInfo = null
  crawlerSettings = {
    maxPages: 6,
    depth: '/',
  }

  get oraStore() {
    return this.props.oraStore
  }

  get osContext() {
    return this.oraStore.osContext
  }

  get context() {
    return this.oraStore.context
  }

  get search() {
    return this.oraStore.search
  }

  // can customize the shown title here
  get title() {
    return this.oraStore.osContext ? this.oraStore.osContext.title : null
  }

  onDrawerClose() {
    this.showCrawler = false
  }

  get drawerTitle() {
    return 'Start Crawling'
  }

  // can show a modal that slides in
  get drawer() {
    if (!this.showCrawler || !this.crawlerInfo) {
      return null
    }
    const fieldProps = {
      row: true,
      labelProps: {
        width: 90,
      },
    }
    return (
      <UI.List
        groupBy="category"
        items={[
          {
            category: 'Preview',
            primary: this.crawlerInfo.title,
            primaryEllipse: true,
            secondary: this.crawlerInfo.entry,
            children: this.crawlerInfo.body,
          },
          ...Object.keys(this.crawlerSettings).map(key => ({
            category: 'Crawl Settings:',
            children: (
              <UI.Field
                label={key}
                sync={this.ref(`crawlerSettings.${key}`)}
                {...fieldProps}
              />
            ),
          })),
        ]}
      />
    )
  }

  get crawlerOptions() {
    return {
      ...this.crawlerInfo,
      ...this.crawlerSettings,
    }
  }

  // this determines when the pane slides in
  get finishedLoading() {
    return this.context && !this.context.isLoading
  }

  willMount() {
    this.on(OS, 'crawler-selection', (event, info) => {
      if (info && Object.keys(info).length) {
        // matching url
        if (info.entry === this.osContext.url) {
          if (!isEqual(info, this.crawlerInfo)) {
            if (this.showCrawler === null) {
              this.showCrawler = true
            }
            const { bodySelector, titleSelector, ...crawlerInfo } = info

            this.crawlerInfo = crawlerInfo
            this.crawlerSettings = {
              ...this.crawlerSettings,
              bodySelector,
              titleSelector,
            }
          }
        } else {
          console.log('not on same url')
        }
      }
    })

    this.watch(() => {
      this.oraStore.showWhiteBottomBg = this.showCrawler
    })
  }

  get contextResults() {
    const title = this.osContext
      ? this.osContext.selection || this.osContext.title
      : ''
    return !this.context || this.context.loading // || this.osContext === null
      ? []
      : this.context
          .search(this.search.length > 0 ? this.search : title, 8)
          // filter same item
          .filter(x => {
            if (!x.item) return true
            if (!this.props.data) return true
            return x.item.url !== this.props.result.data.url
          })
          .map(({ debug, item, similarity }, index) => {
            const title = item.title

            return {
              title,
              // icon: 'link',
              onClick: () => {
                OS.send('open-browser', item.url)
              },
              children: this.context.sentences[index] &&
              this.context.sentences[index].sentence,
              after: (
                <After
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.props.navigate({
                      ...Thing.toResult(item),
                      type: 'context',
                    })
                  }}
                >
                  <debug css={{ position: 'absolute', top: 0, right: 0 }}>
                    <UI.Popover
                      openOnHover
                      closeOnEsc
                      towards="left"
                      width={150}
                      target={<UI.Button circular chromeless icon="help" />}
                    >
                      <UI.List>
                        <UI.ListItem primary={`Similarity: ${similarity}`} />
                        {debug.map(({ word, word2, similarity }, index) => (
                          <UI.ListItem
                            key={index}
                            primary={word}
                            secondary={`${word2}: ${similarity}`}
                          />
                        ))}
                      </UI.List>
                    </UI.Popover>
                  </debug>
                </After>
              ),
            }
          })
  }

  get actions() {
    if (this.showCrawler) {
      return [
        // {
        //   key: Math.random(),
        //   icon: 'remove',
        //   children: 'Cancel',
        //   onClick: async () => {
        //     const cancelled = await this.oraStore.stopCrawl()
        //     console.log('cancelled', cancelled)
        //   },
        // },
        {
          flex: true,
        },
        {
          key: Math.random(),
          icon: 'play',
          children: 'Start Crawl',
          onClick: async () => {
            if (this.showCrawler) {
              const things = await this.oraStore.startCrawl(this.crawlerOptions)
              console.log('made stuff', things)
            } else {
              OS.send('inject-crawler')
              this.showCrawler = true
            }
          },
        },
      ]
    }

    return [
      this.isPinned && {
        icon: 'check',
        children: 'Pinned',
      },
      !this.isPinned && {
        icon: 'ui-1_bold-add',
        children: 'Pin',
        onClick: () => {
          this.oraStore.addCurrentPage()
        },
      },
      {
        flex: true,
      },
      {
        icon: 'bug',
        children: 'Crawl',
        onClick: () => {
          OS.send('inject-crawler')
        },
      },
    ]
  }

  get results() {
    if (this.context) {
      const os = this.search.length === 0 ? [] : []
      return [...os, ...this.contextResults].filter(i => !!i)
    }
    return []
  }
}
