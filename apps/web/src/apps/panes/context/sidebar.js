import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { summarize, summarizeWithQuestion } from './helpers/summarize'
import * as UI from '@mcro/ui'
import { view, watch } from '@mcro/black'
import { Thing } from '~/app'

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

const clean = str => str.replace(/[\r\n|\n|\r|\s]+/gm, ' ').trim()

export default class ContextSidebar {
  // copy it here
  osContext = this.oraStore.osContext
  isCrawling = false
  crawlInfo = null
  @watch
  isPinned = () => this.osContext && Thing.findOne({ url: this.osContext.url })

  willMount() {
    this.on(OS, 'crawler-selection', (event, info) => {
      this.crawlInfo = info
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
                lines.length >= 3
                  ? lines.map((line, i) => (
                      <UI.Text key={i} ellipse opacity={0.5} size={0.9}>
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
    if (this.crawlInfo) {
      return [
        {
          key: Math.random(),
          icon: 'play',
          children: 'Start Crawl',
          onClick: () => {
            console.log('starting crawl')
            this.isCrawling = true
            OS.send('start-crawl')
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
          this.isCrawling = true
          OS.send('inject-crawler')
        },
      },
    ]
  }

  get results() {
    if (this.crawlInfo) {
      return [
        {
          title: this.crawlInfo.title,
          children: this.crawlInfo.body,
        },
      ]
    }
    if (this.isCrawling) {
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
