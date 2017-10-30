import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from './pane'
import { take, flatten, includes } from 'lodash'
import Context from '~/context'

const sleep = n => new Promise(resolve => setTimeout(resolve, n))
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

export class StanfordSidebar {
  results = []
}

class StanfordStore {
  corpus = null
  questions = null
  status = ''
  search = ''
  results = []
  wrong = []

  getData = async () => {
    const json = await (await fetch('/stanford.json')).json()
    const questions = []
    const corpus = flatten(
      json.data.slice(0, 100).map(article => {
        return take(article.paragraphs, 5).map(para => {
          const hash = hashStr(para.context)
          para.qas.forEach(({ question }) => questions.push({ question, hash }))
          return { title: para.context, hash }
        })
      })
    )

    // this.context = new Context(corpus)
    this.corpus = corpus
    this.questions = questions
  }

  willMount() {
    console.log('mounting')
    this.getData()
  }

  runText = s => {
    this.results = this.context.closestItems(s).map(({ item }) => {
      return item.title
    })
  }

  isCorrect = ({ question, hash }) => {
    let right = false
    this.context.closestItems(question).forEach(({ item }) => {
      if (item.hash === hash) right = true
    })
    return right
  }

  runTest = async () => {
    this.wrong = []
    await this.context.onLoad()

    const qs = 300

    let correct = 0
    for (let index in this.questions.slice(0, qs)) {
      await sleep(50)
      this.status = `running ${index}/${qs} | wrong: ${this.wrong
        .length} (${this.wrong.length / index * 100}%)`
      if (this.isCorrect(this.questions[index])) {
        correct++
      } else {
        this.wrong.push(this.questions[index])
      }
    }

    this.status = `got correct ${correct}/${qs}: ${100 * correct / qs}%`
  }
}

@view({
  store: StanfordStore,
})
export class StanfordMain extends React.Component<Props> {
  render({ store, data, paneProps }) {
    return (
      <Pane {...paneProps}>
        <stanford $$fullscreen>
          <status>{store.status}</status>
          <details if={store.wrong.length > 0}>
            <summary>incorrect items</summary>
            {store.wrong.map(wrong => (
              <wrong>
                <UI.Title size={1.2} css={{ alignSelf: 'center' }}>
                  {wrong.question}
                </UI.Title>
                <p>
                  correct is:{' '}
                  {store.corpus.filter(i => i.hash === wrong.hash)[0].title}
                </p>
              </wrong>
            ))}
          </details>
          <buttons $$row>
            <UI.Button onClick={store.runTest}>run tests</UI.Button>
          </buttons>
          <input
            placeholder="question..."
            onChange={e => (store.search = e.target.value)}
            onKeyDown={e => e.keyCode === 13 && store.runText(store.search)}
            value={store.search}
          />
          <results>{store.results.map(r => <p>{r}</p>)}</results>
        </stanford>
      </Pane>
    )
  }

  static style = {
    stanford: {
      margin: 40,
    },
    input: {
      width: 500,
      marginTop: 20,
      alignSelf: 'center',
      fontSize: 16,
      padding: 5,
    },
    p: {
      margin: 20,
    },
  }
}
