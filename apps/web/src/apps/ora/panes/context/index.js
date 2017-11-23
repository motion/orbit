import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneView from '../pane'
import ContextStore from '~/context'
import { take, flatten } from 'lodash'
import { OS } from '~/helpers'

const hashStr = s => {
  let hash = 0,
    i,
    chr
  if (s.length === 0) return hash
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

@view({
  store: class ContextViewStore {
    url = null
    results = []

    getData = async () => {
      const json = await (await fetch('/stanford.json')).json()
      const questions = []
      const corpus = flatten(
        json.data.slice(0, 100).map(article => {
          return take(article.paragraphs, 5).map(para => {
            const hash = hashStr(para.context)
            para.qas.forEach(({ question }) =>
              questions.push({ question, hash })
            )
            return { title: para.context, hash }
          })
        })
      )
      this.context = new ContextStore(corpus)
      this.corpus = corpus
    }

    async willMount() {
      await this.getData()
      window.contextPane = this
      OS.on('set-context', (event, url) => {
        this.url = url
      })
      this.getUrl()
    }

    runContext = text => {}

    getUrl = () => {
      OS.send('get-context')
      // setTimeout(this.getUrl, 500)
    }
  },
})
export default class ContextView {
  render({ store }) {
    return (
      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        css={{ padding: 30 }}
      >
        <UI.Theme name="dark">
          <button
            onClick={() => {
              OS.send('get-context')
            }}
          >
            get
          </button>
          <UI.Text>url is {store.url}</UI.Text>
          <autocomplete>
            <UI.Title>autocomplete</UI.Title>
            {store.autocomplete.map(i => (
              <UI.Text>
                {i.freq} - {i.val}
              </UI.Text>
            ))}
          </autocomplete>
          {store.results.map(text => (
            <UI.Text css={{ width: '100%' }}>{text}</UI.Text>
          ))}
          <PaneView
            stackItems={{
              results: { title: 'hello' },
            }}
          />
        </UI.Theme>
      </div>
    )
  }

  static style = {
    autocomplete: {
      margin: 20,
    },
  }
}
