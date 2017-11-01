import * as React from 'react'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'
import { summarize, summarizeWithQuestion } from './summarize'

export default class ContextSidebar {
  // copy it here
  osContext = this.props.homeStore.osContext

  get context() {
    return this.props.homeStore.context
  }

  get search() {
    return this.props.homeStore.search
  }

  get contextResults() {
    const title = this.osContext ? this.osContext.title : ''
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
          .map(({ item }) => {
            const { title, lines } =
              this.search.length === 0
                ? summarize(item.title)
                : summarizeWithQuestion(item.title, this.search)

            return {
              category: 'Context',
              height: 200,
              children: (
                <paras style={{ width: '100%' }}>
                  <p css={{ opacity: 1, fontSize: 13 }}>{title}</p>
                  {lines.map(line => (
                    <p
                      css={{
                        marginTop: 4,
                        opacity: 0.8,
                        fontSize: 13,
                      }}
                      dangerouslySetInnerHTML={{ __html: addBold(line) }}
                    />
                  ))}
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
          this.props.homeStore.addCurrentPage()
        },
      },
    ]
  }

  get results() {
    if (this.context) {
      const os = this.search.length === 0 ? [] : []
      return [os, ...this.contextResults].filter(i => !!i)
    }
    return []
  }
}
