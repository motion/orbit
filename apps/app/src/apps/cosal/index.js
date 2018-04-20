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
        <results>
          {(store.results || []).map(({ similarity, cosal }, index) => (
            <result>
              <content>
                <text if={index >= 5}>{cosal.fields[0].content}</text>
                <words className="wrap" $$row if={index < 5}>
                  {cosal.fields[0].words.map(({ word, weight }) => (
                    <word css={{ opacity: weight }}>{word}</word>
                  ))}
                </words>
              </content>
              <similarity>similarity {similarity}</similarity>
            </result>
          ))}
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
    cosalViewer: {
      margin: 30,
      pointerEvents: 'all',
      height: '100%',
      overflow: 'scroll',
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
