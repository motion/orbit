// @ts-ignore
import initNlp from './nlpStore/nlpQueryWorker'
import { store, react } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Person } from '@mcro/models'
import { App } from '@mcro/stores'
import { NLPResponse } from './nlpStore/types'

// runs off thread
const { parseSearchQuery, setUserNames } = initNlp()

// @ts-ignore
// window.nlpWorker = { parseSearchQuery, setUserNames }

const DEFAULT_NLP = {
  date: {
    startDate: null,
    endDate: null,
  },
}

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
      immediate: true,
      defaultValue: DEFAULT_NLP,
    },
  )

  peopleNames = modelQueryReaction(
    () => Person.find({ limit: 5000 }),
    people => people.map(person => person.name),
    { poll: 60 * 5 * 1000 },
  )

  updateUsers = react(
    () => this.peopleNames,
    names => {
      // ensure js
      setUserNames(names.slice())
    },
  )
}
