import { ensure, react, store } from '@mcro/black'
import { PersonBitModel } from '@mcro/models'
import { observeMany } from '../../mediator'
// to run in web worker
import initNlp from './nlpQueryWorker'
import { QueryStore } from './QueryStore'
import { NLPResponse } from './types'

const { parseSearchQuery, setUserNames } = initNlp()

// to run it on thread
// import { parseSearchQuery, setUserNames } from './nlpStore/nlpQuery'

@store
export class NLPStore {
  queryStore: QueryStore
  query = ''

  setQuery = (s: string) => {
    this.query = s
  }

  peopleNames: string[] = null
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

  emptyNLP: Partial<NLPResponse> = {
    query: '',
    date: {
      startDate: null,
      endDate: null,
    },
  }

  nlp = react(
    () => this.query,
    async (query, { sleep }) => {
      log('123', query)
      if (!query) return this.emptyNLP
      // debounce a bit less than query
      await sleep(100)
      console.log('run me bro')
      return {
        ...(await parseSearchQuery(query)),
        query,
      }
    },
    {
      defaultValue: this.emptyNLP,
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
