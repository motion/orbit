import { store, react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { PersonBitModel } from '@mcro/models'
import { observeMany } from '@mcro/model-bridge'
import { NLPResponse } from './types'
// to run in web worker
import initNlp from './nlpQueryWorker'
const { parseSearchQuery, setUserNames } = initNlp()

// to run it on thread
// import { parseSearchQuery, setUserNames } from './nlpStore/nlpQuery'

const DEFAULT_NLP: Partial<NLPResponse> = {
  query: '',
  date: {
    startDate: null,
    endDate: null,
  },
}

@store
export class NLPStore {
  peopleNames = null
  peopleNames$ = observeMany(PersonBitModel, {
    args: {
      select: {
        name: true,
      },
      take: 100,
    },
  }).subscribe(values => {
    this.peopleNames = values.map(person => person.name).filter(x => x.trim().length > 1)
  })

  willUnmount() {
    this.peopleNames$.unsubscribe()
  }

  get marks() {
    return this.nlp.marks
  }

  nlp = react(
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
      setUserNames(names.filter(Boolean).slice()) // ensure js
    },
  )
}
