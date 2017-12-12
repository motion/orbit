import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import RelevancyStore from './store'

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
          <content>
            <input
              value={store.query}
              onChange={e => {
                store.query = e.target.value
              }}
            />
            <autocomplete>
              <UI.Title>autocomplete</UI.Title>
              {(store.autocomplete || []).map(i => (
                <UI.Text>
                  {i.word} - {i.weight}
                </UI.Text>
              ))}
            </autocomplete>
            {(store.results || []).map(
              ({ debug, item, toBold, similarity, snippet }, index) => (
                <item key={Math.random()}>
                  <UI.Title
                    fontWeight={400}
                    size={1.2}
                    onClick={() => open(item.url)}
                  >
                    <text
                      style={{ display: 'inline' }}
                      $$row
                      dangerouslySetInnerHTML={{
                        __html: makeBold(
                          item.title + ' - ' + similarity,
                          toBold
                        ),
                      }}
                    />
                  </UI.Title>
                  <UI.Title
                    fontWeight={400}
                    size={1.2}
                    opacity={0.8}
                    onClick={() => open(item.url)}
                  >
                    <text
                      style={{ display: 'inline' }}
                      $$row
                      dangerouslySetInnerHTML={{
                        __html: makeBold(item.subtitle, toBold),
                      }}
                    />
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
      height: '100%',
      overflow: 'scroll',
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
