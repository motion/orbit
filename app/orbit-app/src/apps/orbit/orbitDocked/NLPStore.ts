import { store, react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { NLPResponse } from './nlpStore/types'

// runs off thread
// @ts-ignore
import initNlp from './nlpStore/nlpQueryWorker'
import { PersonBitModel } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
const { parseSearchQuery, setUserNames } = initNlp()
// @ts-ignore
window.nlpWorker = { parseSearchQuery, setUserNames }

// runs on thread
// import { parseSearchQuery, setUserNames } from './nlpStore/nlpQuery'

const DEFAULT_NLP = {
  date: {
    startDate: null,
    endDate: null,
  },
}

// @ts-ignore
@store
export class NLPStore /* extends Store */ {
  peopleNames = null
  peopleNames$ = observeMany(PersonBitModel, {
    args: {
      select: {
        name: true,
      },
    },
  }).subscribe(values => {
    this.peopleNames = values.map(person => person.name)
  })

  willUnmount() {
    this.peopleNames$.unsubscribe()
  }

  get marks() {
    return this.nlp.marks
  }

  nlp: NLPResponse = react(
    // fastest (sync) link to search
    () => App.state.query,
    async (query, { sleep }) => {
      if (!query) {
        return DEFAULT_NLP
      }
      await sleep(150)
      return {
        ...(await parseSearchQuery(query)),
        query,
      }
    },
    {
      defaultValue: DEFAULT_NLP,
    },
  )

  updateUsers = react(
    () => this.peopleNames,
    async (names, { sleep }) => {
      ensure('names', !!names)
      await sleep(200) // debounce
      setUserNames(names.slice()) // ensure js
    },
  )
}
