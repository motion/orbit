import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { Thing } from '~/app'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import { isEqual } from 'lodash'
import After from '~/views/after'
import CrawlSetup from './crawlSetup'
import CrawlerStore from '~/stores/crawlerStore'

// finds commons paths for knowledgebasey sites
const GOOD_LOOKIN_PATH_LIMITS = /^(help|docs|faq|support|h)$/

const idFn = _ => _
const getDefaultDepth = url => {
  const { pathname } = new URL(url)
  if (!pathname) {
    return '/'
  }
  const segments = pathname.split('/')
  if (GOOD_LOOKIN_PATH_LIMITS.test(segments[1])) {
    return `/${segments[1]}`
  }
  return '/'
}

export default class ContextSidebar {
  @watch
  isPinned = () => this.osContext && Thing.findOne({ url: this.osContext.url })
  osContext = null
  previewCrawler = new CrawlerStore()
  crawlerSettings = {
    maxPages: 10000,
    depth: '/',
  }

  willMount() {
    this.watch(function watchSidebarContext() {
      // prevent focusedApp from triggered changes
      const { focusedApp, ...context } = this.oraStore.osContext || {}
      idFn(focusedApp)
      if (context && context.url && !isEqual(context, this.osContext)) {
        this.osContext = context
        this.handleChangeSettings({
          entry: context.url,
          depth: getDefaultDepth(context.url),
        })
      }
    })
  }

  handleChangeSettings = settings => {
    // this is for the preview
    this.crawlerSettings = {
      ...this.crawlerSettings,
      ...settings,
    }
  }

  cancelPreview = () => {
    this.previewCrawler.stop()
    this.previewCrawler.hide()
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
    if (!this.osContext) return
    return {
      title: this.osContext.title,
      image: this.osContext.favicon,
    }
  }

  get drawer() {
    if (!this.previewCrawler.showing) {
      return null
    }
    return {
      title: 'Crawl Settings',
      onClose: this.cancelPreview,
      children: (
        <CrawlSetup
          crawler={this.previewCrawler}
          settings={this.crawlerSettings}
          onChangeSettings={this.handleChangeSettings}
        />
      ),
    }
  }

  // END DRAWER

  // this determines when this pane will appear
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
              data: item,
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
                          icon="emptything"
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
    if (this.previewCrawler.showing) {
      return [
        {
          children: 'Cancel',
          onClick: this.cancelPreview,
        },
        {
          flex: true,
        },
        {
          key: Math.random(),
          icon: 'play',
          children: 'Start Crawl',
          onClick: async () => {
            this.oraStore.crawler.start(this.crawlerSettings)
            this.previewCrawler.hide()
            await this.previewCrawler.stop()
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
        onClick: this.oraStore.addCurrentPage,
      },
      !this.isPinned && {
        icon: 'ui-1_bold-add',
        children: 'Pin',
        onClick: this.oraStore.addCurrentPage,
      },
      !this.oraStore.crawler.isRunning && {
        icon: 'pin',
        children: 'Pin Site',
        onClick: this.previewCrawler.show,
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
