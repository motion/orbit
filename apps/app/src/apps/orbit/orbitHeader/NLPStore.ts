import initNlp from './nlpWorker'
import { store, react } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Person } from '@mcro/models'

// runs off thread
const { parseSearchQuery, setUserNames } = initNlp()

window.x = { parseSearchQuery, setUserNames }

@store
export class NLPStore {
  nlp = react(
    // fastest (sync) link to search
    () => this.props.orbitStore.query,
    async (query, { sleep }) => {
      await sleep(40)
      console.log('what is it', parseSearchQuery)
      return await parseSearchQuery(query)
    },
    { immediate: true },
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
