import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { summarize, summarizeWithQuestion } from './helpers/summarize'
import * as UI from '@mcro/ui'
import { view, watch } from '@mcro/black'
import { Thing } from '~/app'
import { flatten, isEqual } from 'lodash'

@view
class After {
  render({ children, ...props }) {
    return (
      <after {...props}>
        <UI.Icon opacity={0.35} name="arrow-min-right" />
        {children}
      </after>
    )
  }
  static style = {
    after: {
      position: 'relative',
      zIndex: 1000,
      background: [0, 0, 0, 0.2],
      borderLeft: [1, [0, 0, 0, 0.5]],
      margin: -5,
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      '&:hover': {
        background: [255, 255, 255, 0.025],
      },
    },
  }
}

const clean = str => {
  if (typeof str !== 'string') {
    return 'bad string'
  }
  return str.replace(/[\r\n|\n|\r|\s]+/gm, ' ').trim()
}

export default class ContextSidebar {
  // copy it here
  osContext = this.oraStore.osContext
  isShowingCrawlInBrowser = false
  crawlerInfo = null
  crawlerSettings = {
    maxPages: 6,
    depth: '/',
  }

  get crawlerOptions() {
    return {
      ...this.crawlerInfo,
      ...this.crawlerSettings,
    }
  }

  // this determines when the pane slides in
  get finishedLoading() {
    return !this.context.isLoading
  }

  @watch
  isPinned = () => this.osContext && Thing.findOne({ url: this.osContext.url })

  willMount() {
    console.log('willmount')
    this.on(OS, 'crawler-selection', (event, info) => {
      if (info && Object.keys(info).length) {
        // matching url
        if (info.entry === this.osContext.url) {
          if (!isEqual(info, this.crawlerInfo)) {
            console.log('update selection', info)
            this.crawlerInfo = info
            this.crawlerSettings.depth = this.crawlerInfo.depth
          }
        } else {
          console.log('not on same url')
        }
      }
    })
  }

  get oraStore() {
    return this.props.oraStore
  }

  get context() {
    return this.oraStore.context
  }

  get search() {
    return this.oraStore.search
  }

  get contextResults() {
    const title = this.osContext ? this.osContext.title : ''
    return !this.context || this.context.loading // || this.osContext === null
      ? []
      : this.context
          .closestItems(this.search.length > 0 ? this.search : title, 8)
          // filter same item
          .filter(x => {
            if (!x.item) return true
            if (!this.props.data) return true
            return x.item.url !== this.props.result.data.url
          })
          .map(({ debug, item, similarity }) => {
            const title = item.title
            const lines =
              this.search.length === 0
                ? summarize(item.body)
                : summarizeWithQuestion(item.body, this.search)

            return {
              title,
              icon: 'link',
              onClick: () => {
                OS.send('navigate', item.url)
              },
              children:
                Array.isArray(lines) && lines.length >= 2
                  ? flatten(lines)
                      .slice(0, 2)
                      .map((line, i) => (
                        <UI.Text key={i} ellipse opacity={0.65} size={1.1}>
                          {clean(line)}
                        </UI.Text>
                      ))
                  : clean(lines),
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
    if (this.crawlerInfo) {
      return [
        {
          key: Math.random(),
          content: <div $$flex />,
        },
        {
          key: Math.random(),
          icon: 'play',
          children: 'Start Crawl',
          onClick: async () => {
            console.log('starting crawl', this.crawlerOptions)
            this.isShowingCrawlInBrowser = true
            const things = await this.oraStore.startCrawl(this.crawlerOptions)
            console.log('made stuff', things)
          },
        },
        {
          key: Math.random(),
          icon: 'play',
          children: 'Cancel Crawl',
          onClick: async () => {
            const cancelled = await this.oraStore.stopCrawl()
            console.log('cancelled', cancelled)
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
        icon: 'bug',
        children: 'Crawl',
        onClick: () => {
          this.isShowingCrawlInBrowser = true
          OS.send('inject-crawler')
        },
      },
    ]
  }

  get results() {
    if (this.crawlerInfo) {
      console.log('trigger update', this.crawlerSettings)
      return [
        {
          category: 'Preview',
          title: this.crawlerInfo.title,
          children: this.crawlerInfo.body,
        },
        {
          category: 'Settings',
          title: ' ',
          displayTitle: false,
          children: (
            <UI.Field
              row
              label="Max pages:"
              tooltip="This will make the crawler avoid going above this path"
              sync={this.ref('crawlerSettings.maxPages')}
            />
          ),
        },
        {
          category: 'Settings',
          title: ' ',
          displayTitle: false,
          children: (
            <UI.Field
              row
              label="Depth:"
              sync={this.ref('crawlerSettings.depth')}
            />
          ),
        },
        ...Object.keys(this.crawlerInfo).map(key => ({
          category: 'Crawler Selected',
          title: key,
          children: this.crawlerInfo[key],
        })),
      ]
    }
    if (this.isShowingCrawlInBrowser) {
      return [
        {
          title: 'Select content in Chrome',
        },
      ]
    }
    if (this.context) {
      const os = this.search.length === 0 ? [] : []
      return [...os, ...this.contextResults].filter(i => !!i)
    }
    return []
  }
}
