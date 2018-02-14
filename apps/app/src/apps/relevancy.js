import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import SearchStore from '~/stores/searchStore'
import * as ContentStore from '~/stores/contentStore'

const hasString = (string, word) => string.indexOf(word) > -1
const useWorker = !hasString(window.location + '', '?noWorker')
const useDemo = true

const makeBold = (input, toBold) => {
  return input.replace(
    new RegExp('(\\b)(' + toBold.join('|') + ')(\\b)', 'ig'),
    '$1<b style="display: inline;">$2</b>$3',
  )
}

@view({
  store: class RelevancyStore {
    query = ''
    textboxVal = ''
    results = []
    search = new SearchStore({ useWorker })
    autocomplete = []

    async willMount() {
      window.relevancy = this

      await this.getData()
      this.react(
        () => this.query,
        async () => {
          const val = await this.search.getResults(this.query)
          if (val === false) {
            return false
          }
          this.results = val.results
          this.autocomplete = val.autocomplete
        },
        true,
      )
    }

    async getDropboxData() {
      return await (await fetch('/dropbox.json')).json()
    }

    async getData() {
      const documents = useDemo
        ? ContentStore.things
        : await this.getDropboxData()
      this.documents = documents
      this.search.setDocuments(documents)
    }
  },
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
              (
                { debug, item, toBold, matched, similarity, snippet },
                index,
              ) => (
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
                          toBold,
                        ),
                      }}
                    />
                  </UI.Title>
                  <UI.Title
                    fontWeight={500}
                    size={1.1}
                    opacity={1}
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
                  <br />
                  <UI.Title>matched: {JSON.stringify(matched)}</UI.Title>
                </item>
              ),
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
    item: {
      marginTop: 5,
      padding: 10,
      borderBottom: '1px solid rgba(0,0,0,.1)',
    },
    input: {
      fontSize: 24,
      width: 700,
      padding: 6,
    },
  }
}
