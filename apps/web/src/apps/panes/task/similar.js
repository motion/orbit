import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { find } from 'lodash'
import * as React from 'react'
import Conversation from '../views/conversation'

class ContextStore {
  context = []
}

@view.attach('millerStore')
@view({
  store: ContextStore,
})
export default class Context {
  getContext = async () => {
    const { store, data: { title } } = this.props
    const res = await (await fetch(`http://localhost:5000?s=${title}`)).json()
    store.context = res.answers
    store.oov = res.oov
  }
  componentWillMount() {
    this.getContext()
  }

  render({ store }) {
    return (
      <similar>
        <UI.Title fontWeight={200} color="#fff" size={1.2}>
          Context
        </UI.Title>
        <contexts>
          <UI.Title>
            out of vocab: {store.oov ? store.oov.join(', ') : 'none'}
          </UI.Title>
          {store.context.map(id => {
            if (!window._convos) return <h4>need convos</h4>
            const convo = find(window._convos, c => c.id === id)
            return <Conversation {...convo} />
          })}
        </contexts>
      </similar>
    )
  }

  static style = {
    similar: {
      height: 500,
    },
    context: {
      marginTop: 20,
    },
  }
}
