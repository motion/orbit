import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { Thing } from '~/app'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import { isEqual } from 'lodash'
import After from '~/views/after'
import CrawlSetup from './crawlSetup'
import CrawlerStore from '~/stores/crawlerStore'

const idFn = _ => _

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
          depth: new URL(context.url).pathname,
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
      onClose: () => {
        this.previewCrawler.stop()
        this.previewCrawler.hide()
      },
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
          onClick: this.oraStore.crawler.stop,
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
    if (this.previewCrawler.showing) {
      return [
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
      },
      !this.isPinned && {
        icon: 'ui-1_bold-add',
        children: 'Pin',
        onClick: this.oraStore.addCurrentPage,
      },
      {
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
