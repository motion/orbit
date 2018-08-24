import { PersonRepository } from '../repositories'

import { store, react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { NLPResponse } from './nlpStore/types'
import { modelQueryReaction } from '../repositories/modelQueryReaction'

// runs off thread
// @ts-ignore
import initNlp from './nlpStore/nlpQueryWorker'
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

  // TODO select just the names
  peopleNames = modelQueryReaction(
    () => PersonRepository.find({ select: { name: true } }),
    people => people.map(person => person.name),
    { poll: 60 * 5 * 1000 },
  )

  updateUsers = react(
    () => this.peopleNames,
    async (names, { sleep }) => {
      ensure('has names', !!names)
      await sleep(200) // debounce
      setUserNames(names.slice()) // ensure js
    },
  )
}
