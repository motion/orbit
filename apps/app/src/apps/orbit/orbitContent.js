import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitContext from './orbitContext'

const SPLIT_INDEX = 3

const tinyProps = {
  hidePreview: true,
  titleProps: {
    ellipse: 1,
    fontWeight: 400,
    size: 1,
  },
  iconProps: {
    size: 14,
    style: {
      marginTop: 1,
      marginLeft: 15,
    },
  },
  padding: [3, 8],
  style: {
    borderRadius: 5,
  },
}

@view.attach('appStore')
@view
export default class OrbitContent {
  render({ appStore }) {
    const { query, results } = appStore.searchState
    log(`render.OrbitContent`)
    console.log('appStore.results', results.slice())
    return (
      <orbitContent>
        <space css={{ height: 10 }} />
        <notifications
          if={results.length}
          $tiny={!query}
          css={{
            opacity:
              appStore.activeIndex >= 0 && appStore.activeIndex < SPLIT_INDEX
                ? 1
                : 0.5,
          }}
        >
          {results.slice(0, query ? 12 : SPLIT_INDEX).map((result, index) => (
            <OrbitItem
              {...!query && tinyProps}
              key={result.id}
              type="gmail"
              index={index}
              appStore={appStore}
              results={results}
              result={{
                ...result,
                title: result.title,
              }}
              total={results.length}
              {...appStore.getHoverProps({
                result,
                id: index,
              })}
            />
          ))}
        </notifications>
        <OrbitContext if={!query} appStore={appStore} />
        <space css={{ height: 20 }} />
      </orbitContent>
    )
  }

  static style = {
    orbitContent: {
      flex: 1,
    },
    tiny: {
      margin: [0, 10],
    },
    notifications: {
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
    },
  }
}
