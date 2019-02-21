import { observeMany } from '@mcro/bridge'
import { PersonBitModel } from '@mcro/models'
import { decorate, ensure, react } from '@mcro/use-store'
import { NLPResponse } from '../../types/NLPResponse'
import { QueryStore } from '../QueryStore'
// to run in web worker
import initNlp from './nlpQueryWorker'

const { parseSearchQuery, setUserNames } = initNlp()

// to run it on thread
// import { parseSearchQuery, setUserNames } from './nlpStore/nlpQuery'

@decorate
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
      if (!query) return this.emptyNLP
      // debounce a bit less than query
      await sleep(100)
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
