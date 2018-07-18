import initNlp from './nlpWorker'
import { store, react } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Person } from '@mcro/models'
import { App } from '@mcro/stores'

// runs off thread
const { parseSearchQuery, setUserNames } = initNlp()

@store
export class NLPStore {
  get marks() {
    return this.nlp.marks
  }

  nlp = react(
    // fastest (sync) link to search
    () => App.state.query,
    async (query, { sleep }) => {
      await sleep(170)
      return {
        ...(await parseSearchQuery(query)),
        query,
      }
    },
    { immediate: true, defaultValue: { date: {} } },
  )

  updateUsers = modelQueryReaction(
    () => Person.find({ limit: 5000 }),
    people => {
      console.log('setting user names', people)
      setUserNames(people.map(person => person.name))
    },
    // 5 minute poll
    { poll: 60 * 5 },
  )
}
