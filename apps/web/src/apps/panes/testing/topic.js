import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { find } from 'lodash'
import Conversation from '../views/conversation'

@view({
  store: class TopicStore {
    text = ''
    convos = []
    oov = []

    getContext = async () => {
      const res = await (await fetch(
        `http://localhost:5000?s=${this.text}`
      )).json()
      this.convos = res.answers
        .map(id => {
          if (!window._convos) return null
          return find(window._convos, c => c.id === id)
        })
        .filter(n => n)
      this.oov = res.oov
    }
  },
})
export default class Topic {
  render({ store }) {
    return (
      <topic>
        <UI.Title size={1.2}>Topic</UI.Title>
        <input
          css={{ padding: 10, fontSize: 18 }}
          value={store.text}
          onKeyDown={e => e.keyCode === 13 && store.getContext()}
          onChange={e => (store.text = e.target.value)}
        />
        <contexts>
          <UI.Title>
            out of vocab: {store.oov ? store.oov.join(', ') : 'none'}
          </UI.Title>
          <div className="chart">
            <Chart things={store.convos} />
          </div>
          {store.convos.map(convo => <Conversation {...convo} />)}
        </contexts>
      </topic>
    )
  }
}
