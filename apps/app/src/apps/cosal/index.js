import * as React from 'react'
import { view } from '@mcro/black'
import store from './store'

@view({ store })
export default class CoSalPage {
  render({ store }) {
    return (
      <cosalViewer>
        <input
          $query
          type="text"
          value={store.query}
          onChange={e => (store.query = e.target.value)}
        />
        <queryCosal if={store.queryCosal} $$row className="wrap">
          {store.queryCosal.fields[0].words.map(({ string, weight }) => (
            <word css={{ opacity: weight }}>{string}</word>
          ))}
        </queryCosal>
        <summary if={store.queryCosal}>
          summary: {store.cosal && store.cosal.getSummary(store.queryCosal)}
        </summary>
        <results>
          {(store.results || []).map(
            ({ docSimilarity, exactSimilarity, similarity, cosal }, index) => (
              <result>
                <content>
                  <text if={index >= 5}>{cosal.fields[0].content}</text>
                  <words className="wrap" $$row if={index < 5}>
                    {cosal.fields[0].words.map(({ string, weight }) => (
                      <word css={{ opacity: weight }}>{string}</word>
                    ))}
                  </words>
                </content>
                <similarity>similarity {similarity}</similarity>
                <similarity>doc {docSimilarity}</similarity>
                <similarity>exactSimilarity {exactSimilarity}</similarity>
              </result>
            ),
          )}
        </results>
      </cosalViewer>
    )
  }

  static style = {
    content: {
      width: 450,
    },
    similarity: {
      margin: [10, 20],
    },
    queryCosal: {
      width: 500,
    },
    cosalViewer: {
      margin: 30,
      pointerEvents: 'all',
      height: '100%',
      overflow: 'scroll',
    },
    results: {
      marginTop: 15,
    },
    word: {
      marginLeft: 2,
      marginRight: 2,
    },
    query: {
      fontSize: 20,
      width: 800,
      padding: 5,
    },
  }
}
