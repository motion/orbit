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
                (store.context.autocomplete || []).map(i => (
                  <UI.Text>
                    {i.word} - {i.weight}
                  </UI.Text>
                ))}
            </autocomplete>
            {((store.context && store.context.results) || []).map(
              ({ debug, item, toBold, similarity, snippet }, index) => (
                <item key={Math.random()}>
                  <UI.Title
                    fontWeight={400}
                    size={1.2}
                    onClick={() => open(item.url)}
                  >
                    {item.title} - {similarity}
                  </UI.Title>
                  <UI.Title
                    fontWeight={400}
                    size={1.2}
                    opacity={0.8}
                    onClick={() => open(item.url)}
                  >
                    {item.subtitle}
                  </UI.Title>
                  <snippet>
                    <text
                      style={{ display: 'inline' }}
                      $$row
                      dangerouslySetInnerHTML={{
                        __html: makeBold(snippet, toBold),
                      }}
                    />
                  </snippet>
                  <details>
                    <content>
                      <text
                        style={{ display: 'inline' }}
                        $$row
                        dangerouslySetInnerHTML={{
                          __html: makeBold(item.body, toBold),
                        }}
                      />
                    </content>
                  </details>
                </item>
              )
            )}
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
