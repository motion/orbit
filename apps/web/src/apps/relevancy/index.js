import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import RelevancyStore from './store'
import Sidebar from '../panes/sidebar'
import * as Sidebars from '../panes/sidebars'
import * as Constants from '~/constants'

const makeBold = (input, toBold) => {
  return input.replace(
    new RegExp('(\\b)(' + toBold.join('|') + ')(\\b)', 'ig'),
    '$1<b style="display: inline;">$2</b>$3'
  )
}

@view({
  store: RelevancyStore,
})
export default class RelevancyPage {
  render({ store }) {
    return (
      <UI.Theme name="light">
        <relevancy $$draggable>
          <UI.Title size={2}>Relevancy</UI.Title>
          <UI.Title size={1}>
            query expansion: {store.context && store.context.qe}
          </UI.Title>
          <content>
            <input
              value={store.textboxVal}
              onChange={e => {
                store.textboxVal = e.target.value
                store.setSearch(e.target.value)
              }}
              onKeyDown={e => {
                if (e.which === 13) store.search = e.target.value
              }}
            />
            <autocomplete>
              <UI.Title>autocomplete</UI.Title>
              {store.context &&
                store.context.autocomplete.map(i => (
                  <UI.Text>
                    {i.realWord} - {i.val}
                  </UI.Text>
                ))}
            </autocomplete>
            {(store.items || []).map(({ debug, item, similarity }, index) => (
              <item>
                <UI.Title
                  fontWeight={600}
                  size={1.2}
                  onClick={() => open(item.url)}
                >
                  {item.title}
                </UI.Title>
                <div
                  style={{ display: 'inline' }}
                  $$row
                  dangerouslySetInnerHTML={
                    store.sentences[index] && {
                      __html: makeBold(
                        store.sentences[index].sentence,

                        store.sentences[index].toBold
                      ),
                    }
                  }
                  if={store.sentences && store.sentences.length > 0}
                />
                <details>
                  {debug.map(info => (
                    <UI.Text>
                      similarity: {similarity} {info.word} -> {info.word2} :{' '}
                      {info.similarity} [{info.ws2.join(', ')}]
                    </UI.Text>
                  ))}
                </details>
                <buttons $$row>
                  <button onClick={() => store.setSearch(item.title)}>
                    use
                  </button>
                  <UI.Text>similarity: {similarity}</UI.Text>
                </buttons>
              </item>
            ))}
          </content>
        </relevancy>
      </UI.Theme>
    )
  }

  static style = {
    relevancy: {
      margin: 20,
    },
    autocomplete: {
      margin: 20,
      background: `rgba(0,0,0,0.05)`,
      padding: 20,
      width: 600,
    },
    input: {
      fontSize: 24,
      width: 700,
      padding: 6,
    },
  }
}
