import * as React from 'react'
import { view, react } from '@mcro/black'
import { Bit } from '@mcro/models'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { OrbitDockedPane } from './orbitDockedPane'

const findType = (integration, type, skip = 0) =>
  Bit.findOne({
    skip,
    take: 1,
    where: {
      type,
      integration,
    },
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
  })

class OrbitHomeStore {
  setGetResults = react(
    () => this.props.paneStore.activePane === this.props.name,
    isActive => {
      if (!isActive) {
        throw react.cancel
      }
      log('set get results')
      this.props.appStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  results = react(
    async () => {
      return (await Promise.all([
        findType('slack', 'conversation'),
        findType('slack', 'conversation', 1),
        findType('slack', 'conversation', 2),
        findType('google', 'document'),
        findType('google', 'mail'),
        findType('google', 'mail', 1),
        findType('slack', 'conversation'),
        findType('slack', 'conversation'),
        findType('slack', 'conversation'),
      ])).filter(Boolean)
    },
    {
      defaultValue: [],
    },
  )
}

@view({
  store: OrbitHomeStore,
})
export class OrbitHome {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render({ store }) {
    log('HOME---------------')
    return (
      <OrbitDockedPane name="home">
        <Masonry>
          {store.results.map((bit, index) => (
            <OrbitCard
              pane="summary"
              key={`${bit.id}${index}`}
              index={index}
              bit={bit}
              total={store.results.length}
              hoverToSelect
              expanded
              style={index < 2 && this.span2}
            />
          ))}
        </Masonry>
      </OrbitDockedPane>
    )
  }
}
