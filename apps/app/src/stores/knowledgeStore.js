import { memoize } from 'lodash'
import { store } from '@mcro/black'
import { API_URL } from '~/constants'
import { App } from '@mcro/all'
import marginal from './language/marginal.json'

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
      () => App.hoveredWordName,
      async () => {
        if (
          App.hoveredWordName &&
          App.state.highlightWords[App.hoveredWordName]
        ) {
          this.word = App.hoveredWordName
          let knowledge = await this.getKnowledge(App.hoveredWordName)
          if (knowledge.length === 0) {
            return false
          }
          knowledge = knowledge[0].result
          knowledge.results = marginal
            .filter(
              ({ title }) =>
                (title || '')
                  .toLowerCase()
                  .indexOf(App.hoveredWordName.toLowerCase()) > -1,
            )
            .slice(0, 3)
          App.setState({ knowledge })
        }
      },
    )
  }
}
