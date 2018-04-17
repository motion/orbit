import * as React from 'react'
import { view } from '@mcro/black'
import { includes } from 'lodash'
import * as UI from '@mcro/ui'
import store from './store'

@view({ store })
export default class CoSalPage {
  render({ store }) {
    const { documents } = store

    return (
      <cosal>
        <UI.Title size={2}>Cosal</UI.Title>
        <input
          value={store.query}
          css={{ width: 700, padding: 10, fontSize: 16, margin: 5 }}
          onChange={e => (store.query = e.target.value)}
        />
        <cosalInfo if={store.queryCosal}>
          <words css={{ fontSize: 18 }} $$row>
            {store.queryCosal.words.map(({ word, weight }) => (
              <word css={{ opacity: weight, marginLeft: 3, marginRight: 3 }}>
                {word}
              </word>
            ))}
          </words>
          <closest css={{ marginTop: 10 }}>
            {JSON.stringify(store.queryCosal.closest)}
          </closest>
        </cosalInfo>
        <container $$row>
          <documents>
            {(store.results || []).map(
              ({
                content,
                similarity,
                cosalSimilarity,
                exactSimilarity,
                index,
              }) => (
                <document
                  onClick={() => {
                    store.toggle(index)
                  }}
                  $highlight={includes(store.selected, index)}
                >
                  <text css={{ fontSize: 14 }} $body>
                    {content}
                  </text>
                  <similarity if={similarity}>
                    total similarity: {('' + similarity).slice(0, 4)} (cosal:{' '}
                    {('' + cosalSimilarity).slice(0, 4)}, exact:{' '}
                    {('' + exactSimilarity).slice(0, 4)})
                  </similarity>
                  <meta css={{ marginTop: 10 }} if={store.hasLoadedCosal}>
                    <UI.Title>closest words</UI.Title>
                    <closest $$row>
                      {store.documentCosal[index].closest.map(
                        ([word, similarity]) => (
                          <word css={{ marginLeft: 3, marginRight: 3 }}>
                            {word} {('' + similarity).slice(0, 4)}
                          </word>
                        ),
                      )}
                    </closest>
                  </meta>
                </document>
              ),
            )}
          </documents>
          <info>
            <top $$row>
              <UI.Title size={1.5}>{store.selected.length} selected</UI.Title>
              <UI.Button
                css={{ marginLeft: 10 }}
                onClick={() => (store.selected = [])}
              >
                clear all
              </UI.Button>
            </top>
            <documents>
              {store.selected.map(index => {
                const { words, vector } = store.documentCosal[index]

                return (
                  <document>
                    <words $$row className="wrap">
                      {words.map(({ word, weight }, index) => (
                        <UI.Text
                          css={{ marginLeft: 3, marginRight: 3 }}
                          opacity={weight}
                          $word
                        >
                          {word}
                        </UI.Text>
                      ))}
                    </words>
                  </document>
                )
              })}
            </documents>
          </info>
        </container>
      </cosal>
    )
  }

  static style = {
    cosal: {
      margin: 50,
      pointerEvents: 'all',
      overflow: 'scroll',
      height: '100%',
    },
    highlight: {
      background: `rgba(0,0,0,0.05)`,
      border: '1px solid rgba(0,0,0,0.1) !important',
    },
    document: {
      margin: 5,
      padding: 10,
      width: 400,
      border: '1px solid rgba(0,0,0,0)',
    },
    body: {
      marginTop: 5,
    },
    info: {
      margin: 30,
    },
    top: {
      alignItems: 'center',
    },
  }
}
