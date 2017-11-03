import * as React from 'react'
import { OS, fuzzy } from '~/helpers'
import { summarize, summarizeWithQuestion } from './helpers/summarize'
import * as UI from '@mcro/ui'
import { view, watch } from '@mcro/black'
import { Thing } from '~/app'

@view
class After {
  render(props) {
    log('props', props, this.props)
    return (
      <after {...props}>
        <UI.Icon opacity={0.35} name="arrow-min-right" />
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

const similarityOpacity = similarity => {
  if (similarity > 5000) {
    return 0.1
  }
  if (similarity > 2000) {
    return 0.2
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
  // copy it here
  osContext = this.oraStore.osContext

  @watch
  isPinned = () => this.osContext && Thing.find({ url: this.osContext.url })

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
              children:
                lines.length >= 3
                  ? lines.map((line, i) => (
                      <UI.Text key={i} ellipse>
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
                />
              ),
              below: (
                <UI.Row
                  css={{ marginTop: 5, overflowX: 'scroll' }}
                  itemProps={{ height: 20 }}
                >
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
