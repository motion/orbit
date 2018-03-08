// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { last } from 'lodash'

const cleanDocText = text =>
  text
    // multiple spaces
    .replace(/\s\s+/g, ' ')
    .replace(/\â\€\™/g, "'")
    .replace(/\â\€\˜/g, "'")
    .replace(/\â\€\¦/g, '')
    .replace(/\â\€\œ/g, '"')
    .replace(/\â\€\�/g, '"')
    .replace(/\�/g, '')
    .replace(/\Â/g, '')
    .replace(/â€“/g, '"')
    .replace(/\â\€\¦/g, '')

@view
class Results {
  render({ data: { results } }) {
    return (
      <results>
        {results.map(({ title, text }, index) => (
          <result $borderResult={index !== results.length - 1}>
            <UI.Title size={1.1} fontWeight={400}>
              {cleanDocText(title)}
            </UI.Title>
            <UI.Text opacity={0.8}>
              {cleanDocText(text || '').slice(0, 140)}
            </UI.Text>
          </result>
        ))}
      </results>
    )
  }

  static style = {
    results: {
      margin: [0, 10],
    },
    result: {
      paddingTop: 10,
      paddingBottom: 10,
      marginRight: 5,
      marginLeft: 5,
    },
    borderResult: {
      borderBottom: '1px solid rgba(0,0,0,0.1)',
    },
  }
}

@view
export default class KnowledgeView {
  render({ store, data }) {
    const { name, detailedDescription, description, results } = data
    return (
      <knowledge>
        <top $$row>
          <UI.Title size={1.5} $name>
            {name}
          </UI.Title>
          <badge>{last(data['@type'])}</badge>
        </top>
        <container if={results.length > 0}>
          <UI.Text size={1} $description>
            {description}
          </UI.Text>
          <Results data={data} />
        </container>
        <container if={results.length === 0}>
          <UI.Text size={1.2} $description>
            {detailedDescription
              ? detailedDescription.articleBody
              : description}
          </UI.Text>
        </container>
      </knowledge>
    )
  }

  static style = {
    top: {
      justifyContent: 'space-between',
    },
    badge: {
      background: `rgba(0,0,0,0.05)`,
      padding: [2, 8],
      opacity: 0.8,
      fontSize: 12,
      border: '1px solid rgba(0,0,0,0.2)',
      borderRadius: 3,
    },
    knowledge: {
      padding: 15,
    },
    description: {
      marginTop: 5,
      lineHeight: 1.5,
    },
  }
}
