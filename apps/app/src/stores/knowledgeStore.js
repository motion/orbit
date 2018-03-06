import { memoize } from 'lodash'
import { store } from '@mcro/black'
import { API_URL } from '~/constants'
import Screen from '@mcro/screen'
import dataset from './language/pg.json'

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
      () => Screen.hoveredWordName,
      async () => {
        if (
          Screen.hoveredWordName &&
          Screen.appState.highlightWords[Screen.hoveredWordName]
        ) {
          this.word = Screen.hoveredWordName
          let knowledge = await this.getKnowledge(Screen.hoveredWordName)
          if (knowledge.length === 0) {
            return false
          }
          knowledge = knowledge[0].result
          knowledge.results = dataset
            .filter(
              ({ title }) =>
                (title || '')
                  .toLowerCase()
                  .indexOf(Screen.hoveredWordName.toLowerCase()) > -1,
            )
            .slice(0, 3)
          Screen.setState({ knowledge })
        }
      },
    )
  }
}
