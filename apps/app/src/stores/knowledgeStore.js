import { memoize } from 'lodash'
import { store } from '@mcro/black'
import { API_URL } from '~/constants'

@store
export default class KnowledgeStore {
  knowledge = null
  word = null

  getKnowledge = memoize(async word => {
    const json = await (await fetch(
      `${API_URL}/knowledge?entity=${word}`,
    )).json()

    return json
  })

  willMount() {
    this.react(
      () => {
        this.word
      },
      async () => {
        this.knowledge = this.getKnowledge(word)
      },
    )
  }
}
