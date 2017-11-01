import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from './pane'

const sleep = n => new Promise(resolve => setTimeout(resolve, n))

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
    const questions = []
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
