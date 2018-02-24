import * as React from 'react'
import { view } from '@mcro/black'
import { last } from 'lodash'
import * as UI from '@mcro/ui'
import LanguageStore from '~/stores/language'
import { decodeEntity } from '~/stores/language/utils'
console.log('in relevancy')

@view({
  store: LanguageStore,
})
export default class RelevancyPage {
  render({ store }) {
    let article = store.articleWithEntities
    if (!article) {
      return <loading>loading</loading>
    }

    const lines = article.split('\n')

    return (
      <outer>
        <container $$row>
          <inner>
            <UI.Title size={2}>
              {store.documents[store.articleIndex].title}
            </UI.Title>
            <lines>
              {lines.map(line => {
                return (
                  <line $$row>
                    {line.split(/[\ ]+/g).map(word => {
                      const highlight = word.indexOf('::') > -1
                      let normal = word
                      let highlightWord = null

                      if (highlight) {
                        const middle = decodeEntity(word)
                        normal = last(word.split('::'))
                        highlightWord = middle
                      }

                      return (
                        <word $$row>
                          <highlight
                            if={highlightWord}
                            onMouseOver={e => {
                              store.boxMarginTop = e.nativeEvent.clientY
                              store.setActiveWord(highlightWord)
                            }}
                          >
                            {highlightWord}
                          </highlight>
                          {normal}
                        </word>
                      )
                    })}
                  </line>
                )
              })}
            </lines>
            <buttons $$row>
              <UI.Button onClick={() => store.activate(store.articleIndex - 1)}>
                previous
              </UI.Button>
              <UI.Button onClick={() => store.activate(store.articleIndex + 1)}>
                next
              </UI.Button>
            </buttons>
          </inner>
          <box
            if={store.activeWord && store.knowledge}
            style={{ marginTop: Math.max(20, store.boxMarginTop - 230) }}
          >
            <titleArea $$spaceBetween $$row>
              <UI.Title size={1.2} $title>
                {store.knowledge
                  ? store.knowledge.result.name
                  : store.activeWord || 'nothing selected'}
              </UI.Title>
            </titleArea>
            <results>
              {(store.activeResults || []).map(
                ({ index, type, doc, score }, resultIndex) => {
                  return (
                    <result
                      onClick={() => {
                        store.activate(index)
                      }}
                    >
                      <docType if={type === 'result'}>
                        <top $$row>
                          <icon $$row>
                            <UI.Icon color="0084b4" name="education_paper" />
                            <name css={{ marginLeft: 5 }}>
                              {doc.title.slice(0, 25)}
                            </name>{' '}
                          </icon>
                          <score>({(score + '').slice(0, 4)})</score>
                        </top>
                        <UI.Text
                          if={resultIndex < 3}
                          opacity={0.7}
                          size={0.8}
                          $snippet
                        >
                          {store.snippet(index, store.activeWord)}
                        </UI.Text>
                      </docType>
                      <docType
                        onClick={() => {
                          const url = `https://twitter.com/${doc.originalHandle ||
                            doc.handle}/status/${doc.id}`
                          window.open(url)
                        }}
                        if={type === 'outerResult'}
                      >
                        <top $$row>
                          <icon $$row>
                            <UI.Icon color="0084b4" name="twitter" />
                            <name css={{ marginLeft: 5 }}>
                              @{doc.handle}
                            </name>{' '}
                          </icon>
                          <score>({(score + '').slice(0, 4)})</score>
                        </top>
                        <UI.Text opacity={0.7} size={0.8} $snippet>
                          {doc.text}
                        </UI.Text>
                      </docType>
                    </result>
                  )
                },
              )}
            </results>
            <UI.Title
              $noResults
              if={(store.activeResults || []).length === 0}
              size={1.2}
              opacity={0.8}
            >
              No posts found
            </UI.Title>
            <secondary>
              <preview
                $$row
                onClick={() => (store.knowledgeMore = !store.knowledgeMore)}
              >
                <image if={!store.knowledgeMore} style={{ width: 40 }}>
                  <img
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                    }}
                    if={store.knowledge && store.knowledge.result.image}
                    src={store.knowledge.result.image.contentUrl}
                  />
                </image>
                <middle style={{ minHeight: 35 }} $$row $$alignItems="center">
                  <UI.Button
                    if={store.knowledge.result.detailedDescription}
                    icon={
                      store.knowledgeMore
                        ? 'arrows-1_minimal-down'
                        : 'arrows-1_minimal-up'
                    }
                    iconSize={12}
                    $showMore
                    chromeless
                  />
                  <UI.Title
                    size={
                      store.knowledge.result.description.length > 15 ? 0.8 : 1
                    }
                    if={
                      store.knowledge &&
                      store.knowledge.result &&
                      store.knowledge.result.description
                    }
                    $title
                  >
                    {store.knowledge.result.description}
                  </UI.Title>
                </middle>
              </preview>
              <desc
                if={
                  store.knowledgeMore &&
                  store.knowledge &&
                  store.knowledge.result.detailedDescription
                }
                $more
              >
                <image
                  $$alignSelf="center"
                  style={{ marginBottom: 5, width: 120 }}
                >
                  <img
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                    }}
                    if={store.knowledge && store.knowledge.result.image}
                    src={store.knowledge.result.image.contentUrl}
                  />
                </image>
                <UI.Text size={0.9}>
                  {store.knowledge.result.detailedDescription.articleBody}
                </UI.Text>
                <a
                  href={store.knowledge.result.detailedDescription.url}
                  target="_blank"
                  $wiki
                >
                  more
                </a>
              </desc>
            </secondary>
          </box>
        </container>
      </outer>
    )
  }

  static style = {
    outer: {},
    loading: {
      margin: 40,
    },
    buttons: {
      marginTop: 15,
      justifyContent: 'space-between',
    },
    more: {
      padding: 15,
      lineHeight: 1.5,
    },
    titleArea: {
      margin: 15,
    },
    noResults: {
      alignSelf: 'center',
    },
    middle: {
      marginRight: 30,
    },
    wiki: {
      color: '#5f68f7',
      alignSelf: 'flex-end',
      marginRight: 10,
    },
    preview: {
      alignItems: 'center',
      borderTop: '1px solid #eee',
      marginTop: 30,
      justifyContent: 'space-between',
      boxShadow: '0px 1px 1px rgba(0,0,0,0.05)',
      width: '100%',
      borderBottom: '1px solid #eee',
    },
    secondary: {},
    result: {
      marginTop: 3,
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: [2, 5],
      '&:hover': {
        background: '#fefefe',
      },
      borderBottom: '1px solid #eee',
      paddingBottom: 5,
    },
    top: {
      justifyContent: 'space-between',
    },
    snippet: {
      marginTop: 5,
    },
    box: {
      border: '1px solid #eee',
      marginLeft: 20,
      width: 250,
      height: '100%',
      animate: 'all 150ms ease-in',
      boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.05)',
      borderRadius: 5,
    },
    inner: {
      marginTop: 20,
      marginLeft: 20,
    },
    container: {
      height: '100%',
      overflow: 'scroll',
      pointerEvents: 'all',
    },
    lines: {
      flex: 1,
      marginTop: 20,
    },
    word: {
      marginLeft: 5,
      opacity: 0.7,
    },
    highlight: {
      // opacity: '1 !important',
      // borderBottom: '1px solid rgba(0,0,0,0.2)',
      // fontWeight: 400,
    },
    line: {
      flexWrap: 'wrap',
      width: 600,
      marginTop: 5,
    },
  }
}
