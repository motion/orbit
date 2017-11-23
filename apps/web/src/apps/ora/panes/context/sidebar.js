import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { Thing } from '~/app'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import { isEqual } from 'lodash'
import After from '~/views/after'
import CrawlSetup from './crawlSetup'

const idFn = _ => _

export default class ContextSidebar {
  @watch
  isPinned = () => this.osContext && Thing.findOne({ url: this.osContext.url })

  crawlerSettings = {
    maxPages: Infinity,
    depth: '/',
  }

  osContext = null

  willMount() {
    this.watch(() => {
      // prevent focusedApp from triggered changes
      const { focusedApp, ...context } = this.oraStore.osContext
      idFn(focusedApp)
      if (!isEqual(context, this.osContext)) {
        this.osContext = context
        this.setDepth()
      }
    })
    this.watch(() => {
      const { crawlerInfo } = this
      if (!crawlerInfo) return
      const { bodySelector, titleSelector } = crawlerInfo
      const crawlerSettings = {
        ...this.crawlerSettings,
        bodySelector,
        titleSelector,
      }
      if (!isEqual(crawlerSettings, this.crawlerSettings)) {
        this.crawlerSettings = crawlerSettings
      }
    })
    // this.watch(() => {
    //   this.oraStore.showWhiteBottomBg = this.isShowingCrawlDrawer
    // })
  }

  setDepth = () => {
    if (!this.osContext.url) {
      return null
    }

    this.crawlerSettings.depth = new URL(this.osContext.url).pathname
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

  // can customize the shown title here
  get title() {
    return this.osContext ? this.osContext.title : null
  }

  onDrawerClose() {
    this.oraStore.crawler.showing = false
  }

  get drawerTitle() {
    return 'Crawl Settings'
  }

  // can show a modal that slides in
  get drawer() {
    if (!this.oraStore.crawler.showing) {
      return null
    }

    return (
      <CrawlSetup
        settings={this.crawlerSettings}
        osContext={this.osContext}
        onChangeSettings={settings => (this.crawlerSettings = settings)}
      />
    )

    const fieldProps = {
      row: true,
      labelProps: {
        width: 90,
      },
    }

    return (
      <UI.List
        css={{
          maxWidth: '100%',
        }}
        groupBy="category"
        items={
          /*[
          {
            category: 'Preview',
            primary: this.crawlerSettings.title,
            primaryEllipse: true,
            secondary: this.crawlerSettings.entry,
            children: this.crawlerSettings.body,
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
        ]*/ [
            {
              category: 'Settings',
              children: <div />,
            },
          ]
        }
      />
    )
  }

  // this determines when the pane slides in
  get finishedLoading() {
    return this.context && !this.context.isLoading
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
              type: 'context',
              // icon: 'link',
              onClick: () => {
                OS.send('open-browser', item.url)
              },
              children:
                this.context.sentences[index] &&
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
                      target={
                        <UI.Button
                          circular
                          chromeless
                          opacity={0.2}
                          icon="help"
                        />
                      }
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
    if (this.oraStore.crawler.results) {
      return [
        {
          icon: 'remove',
          children: 'Cancel',
          onClick: this.oraStore.cancelResults,
          theme: 'red',
        },
        {
          flex: true,
        },
        {
          icon: 'check',
          children: 'Save',
          onClick: this.oraStore.commitResults,
          theme: 'green',
        },
      ]
    }
    if (this.oraStore.crawler.showing) {
      return [
        {
          flex: true,
        },
        {
          key: Math.random(),
          icon: 'play',
          children: 'Start Crawl',
          onClick: async () => {
            this.oraStore.removeCrawler()
            await this.oraStore.startCrawl(this.crawlerOptions)
          },
        },
      ]
    }

    return [
      {
        flex: true,
      },
      this.isPinned && {
        icon: 'check',
        children: 'Pinned',
      },
      !this.isPinned && {
        icon: 'ui-1_bold-add',
        children: 'Pin',
        onClick: this.oraStore.addCurrentPage,
      },
      {
        icon: 'pin',
        children: 'Pin Site',
        onClick: this.oraStore.injectCrawler,
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
