import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { summarize, summarizeWithQuestion } from './helpers/summarize'
import { Thing } from '~/app'
import * as UI from '@mcro/ui'

const similarityOpacity = similarity => {
  if (similarity > 5000) {
    return 0.1
  }
  if (similarity > 2000) {
    return 0.3
  }
  if (similarity > 1000) {
    return 0.5
  }
  if (similarity > 500) {
    return 0.7
  }
  return 1
}

export default class ContextSidebar {
  get oraStore() {
    return this.props.oraStore
  }

  // copy it here
  osContext = this.oraStore.osContext

  get context() {
    return this.oraStore.context
  }

  get search() {
    return this.oraStore.search
  }

  get contextResults() {
    const title = this.osContext ? this.osContext.title : ''
    log('title is', title)
    const addBold = line => {
      const r = new RegExp('(' + this.search.split(' ').join('|') + ')', 'ig')
      return line.replace(
        r,
        '<b style="font-weight: 400; color: #aed6ff;">$1</b>'
      )
    }
    return !this.context || this.context.loading // || this.osContext === null
      ? []
      : this.context
          .closestItems(this.search.length > 0 ? this.search : title, 5)
          .map(({ debug, item, similarity }) => {
            const title = item.title
            const lines =
              this.search.length === 0
                ? summarize(item.body)
                : summarizeWithQuestion(item.body, this.search)

            return {
              category: 'Context',
              height: 200,
              title,
              onClick: () => {
                OS.send('navigate', item.url)
              },
              children: lines.map((line, index) => (
                <UI.Text key={index} ellipse html={addBold(line)} />
              )),
              after: (
                <UI.Row css={{ marginTop: 5, overflowX: 'scroll' }}>
                  <UI.Button tooltip={`Similarity: ${similarity}`}>
                    Info
                  </UI.Button>
                  {debug.map(({ word, word2, similarity }) => (
                    <UI.Button
                      chromeless
                      inline
                      tooltip={`${word2} : ${similarity}`}
                      key={word}
                      opacity={similarityOpacity(similarity)}
                    >
                      {word}
                    </UI.Button>
                  ))}
                </UI.Row>
              ),
            }
          })
  }

  get actions() {
    return [
      {
        icon: 'ui-1_bold-add',
        children: 'Pin',
        onClick: () => {
          this.oraStore.addCurrentPage()
        },
      },
      {
        icon: 'bug',
        children: 'Crawl',
        onClick: async () => {
          const val = await (await fetch('http://localhost:3000')).json()
          val.forEach(item => {
            Thing.create({
              title: item.title,
              body: item.content,
              integration: 'manual',
              type: 'manual',
              url: item.url,
            })
          })
          console.log('val is', val)
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
