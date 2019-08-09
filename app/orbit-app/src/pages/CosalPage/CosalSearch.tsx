import { loadMany } from '@o/bridge'
import { NLP } from '@o/kit'
import { getSearchableText, SearchByTopicModel } from '@o/models'
import { react, useStore } from '@o/use-store'
import * as React from 'react'

import CosalSaliency from './CosalSaliency'

const nlp = new NLP()

class SearchStore {
  query = 'blast me off'

  querySetter = val => () => {
    this.query = val
  }

  results = react(
    () => this.query,
    query => loadMany(SearchByTopicModel, { args: { query, count: 10 } }),
    {
      defaultValue: [],
    },
  )

  topics = react(
    () => this.results.map(x => `${x.title}${x.body}`).join(' '),
    query => nlp.getTopics({ query, count: 10 }),
    {
      defaultValue: [],
    },
  )

  topWords = react(() => this.query, text => nlp.getMostSalientWords({ text }), {
    defaultValue: [],
  })
}

export default function CosalSearch() {
  const store = useStore(SearchStore)
  return (
    <div style={{ padding: 50 }}>
      <div style={{ flexFlow: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <input
          style={{ width: 500, fontSize: 20 }}
          onChange={e => (store.query = e.target.value)}
          value={store.query}
        />
        <CosalSaliency query={store.query} />
      </div>

      <div style={{ flexFlow: 'row', flex: 1 }}>
        <div style={{ flex: 2 }}>
          <div
            style={{
              padding: 20,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            <h4>Search results</h4>
            {store.results.map((result, index) => (
              <div key={index} style={{ marginBottom: 10 }}>
                <p>{getSearchableText(result)}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 10,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            <h4>Top topics for results</h4>
            {store.topics.map((result, index) => (
              <div key={index} style={{ marginBottom: 10 }} onClick={store.querySetter(result)}>
                <p>{result}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 10,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            <h4>Top words across corpus</h4>
            {store.topWords.map((word, index) => (
              <div key={index} style={{ marginBottom: 10 }} onClick={store.querySetter(word)}>
                <p>{word}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
