import { view } from '~/helpers'
import { Button } from '~/ui'
import Router from '~/router'
import Editor from '~/views/editor'

@view({
  store: class {
    adding = false
    input = null

    addTopics = () => {
      this.adding = true
      setTimeout(() => {
        this.input.focus()
      }, 100)
    }

    setTopics = text => {
      this.props.onChange(text.split(' '))
    }
  },
})
export default class Topics {
  render({ topics, store }) {
    const showInput = store.adding || topics.length > 0

    return (
      <topics>
        <add if={!showInput} onClick={store.addTopics}>
          add topics
        </add>
        <input
          if={store.showInput}
          ref={store.ref('input').set}
          value={topics.join(' ')}
          onChange={e => store.setTopics(e.target.value)}
        />
      </topics>
    )
  }

  static style = {}
}
