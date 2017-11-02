import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { summarize, summarizeWithQuestion } from './helpers/summarize'
import * as UI from '@mcro/ui'

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
            const { lines } =
              this.search.length === 0
                ? summarize(item.body)
                : summarizeWithQuestion(item.body, this.search)

            return {
              category: 'Context',
              height: 200,
              title,
              subtitle: `Similarity: ${similarity}`,
              onClick: () => {
                OS.send('navigate', item.url)
              },
              children: (
                <paras style={{ width: '100%' }}>
                  {lines.map(line => <UI.Text html={addBold(line)} />)}
                  <debug>
                    {debug.map(({ word, word2, similarity }) => (
                      <item>
                        {word} -> {word2}: {similarity}
                      </item>
                    ))}
                  </debug>
                </paras>
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
