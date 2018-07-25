// @ts-ignore
import initNlp from './nlpStore/nlpQueryWorker'
import { store, react, Store } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Person } from '@mcro/models'
import { App } from '@mcro/stores'
import { TYPES, NLPResponse } from './nlpStore/types'

// runs off thread
const { parseSearchQuery, setUserNames } = initNlp()

// @ts-ignore
window.nlpWorker = { parseSearchQuery, setUserNames }

@store
export class NLPStore extends Store {
  types = TYPES

  get marks() {
    return this.nlp.marks
  }

  nlp: NLPResponse = react(
    // fastest (sync) link to search
    () => App.state.query,
    async (query, { sleep }) => {
      await sleep(150)
      return {
        ...(await parseSearchQuery(query)),
        query,
      }
    },
    {
      immediate: true,
      defaultValue: { date: { startDate: null, endDate: null } },
    },
  )

  updateUsers = modelQueryReaction(
    () => Person.find({ limit: 5000 }),
    people => {
      setUserNames(people.map(person => person.name))
    },
    // 5 minute poll
    { poll: 60 * 5 },
  )
}
