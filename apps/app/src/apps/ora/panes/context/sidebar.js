import * as React from 'react'
import { Thing } from '~/app'
import { watch } from '@mcro/black'
import { isEqual } from 'lodash'
import CrawlSetup from './crawlSetup'
import CrawlerStore from '~/stores/crawlerStore'
import { Desktop } from '@mcro/all'

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
  @watch isPinned = () => this.app && Thing.findOne({ url: this.app.url })
  app = null
  previewCrawler = new CrawlerStore()
  crawlerSettings = {
    maxPages: 10000,
    depth: '/',
  }

  willMount() {
    this.watch(function watchAppState() {
      // prevent name from triggered changes
      const { name, ...state } = Desktop.state.appState || {}
      idFn(name)
      if (state && state.url && !isEqual(state, this.app)) {
        this.app = state
        this.handleChangeSettings({
          entry: state.url,
          depth: getDefaultDepth(state.url),
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
  get search() {
    return this.oraStore.ui.search
  }
  get result() {
    return this.oraStore.stack.last.result
  }

  // can customize the shown title here
  get title() {
    if (!this.app) return
    return {
      title: this.result.title.trim().slice(0, 100),
      image: this.app.favicon,
    }
  }

  get minHeight() {
    return this.drawer ? 400 : null
  }

  get drawer() {
    if (!this.previewCrawler.showing) {
      return null
    }
    return {
      title: 'Pin Settings',
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
    return true
  }

  pinCurrent = () => {
    this.oraStore.pin.add(Desktop.state.appState)
  }

  unpinCurrent = () => {
    this.oraStore.pin.remove(Desktop.state.appState)
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
    let websiteActions = []
    if (Desktop.state.appState && Desktop.state.appState.url) {
      websiteActions = [
        this.isPinned && {
          icon: 'check',
          children: 'Pinned',
          tooltip: 'Remove pin',
          onClick: this.unpinCurrent,
        },
        !this.isPinned && {
          icon: 'ui-1_bold-add',
          children: 'Pin',
          onClick: this.pinCurrent,
        },
        !this.oraStore.crawler.isRunning && {
          icon: 'pin',
          children: 'Pin Site',
          onClick: this.previewCrawler.show,
        },
      ].filter(Boolean)
    }
    return [
      {
        flex: true,
      },
      ...websiteActions,
    ]
  }

  get results() {
    let results = this.oraStore.searchResults
    if (!results.length) {
      results = [
        {
          children: 'No results...',
          selectable: false,
        },
      ]
    }
    return results
  }
}
