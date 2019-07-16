import { observeMany } from '@o/bridge'
import { BitModel } from '@o/models'
import { decorate, ensure, react } from '@o/use-store'

import { NLPResponse } from '../../types/NLPResponse'
import { QueryStore } from '../QueryStore'
import initNlp from './nlpQuery.worker'

// to run in web worker
const { parseSearchQuery, setUserNames } = initNlp()

// to run it on thread
// import { parseSearchQuery, setUserNames } from './nlpStore/nlpQuery'

@decorate
export class NLPStore {
  queryStore: QueryStore | null = null
  query = ''

  setQuery = (s: string) => {
    this.query = s
  }

  peopleNames: string[] = []
  peopleNames$ = observeMany(BitModel, {
    args: {
      select: {
        title: true,
      },
      where: {
        type: 'person',
      },
      take: 100,
    },
  }).subscribe(bits => {
    this.peopleNames = bits.map(bit => bit.title || '').filter(x => x.trim().length > 1)
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
