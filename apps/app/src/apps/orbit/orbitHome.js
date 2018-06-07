import * as React from 'react'
import { view, react } from '@mcro/black'
import { Bit } from '@mcro/models'
import { SubTitle } from '~/views'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { OrbitDockedPane } from './orbitDockedPane'

const postfix = [
  'st',
  'nd',
  'rd',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'st',
  'nd',
  'rd',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'st',
]

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

const selectedTheme = { color: 'rgb(42.4%, 24.8%, 96%)', background: '#fff' }

@view({
  store: OrbitHomeStore,
})
export class OrbitHome {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render({ store }) {
    log('HOME---------------')
    const locale = 'en-US'
    const now = new Date()
    const day = now.toLocaleDateString(locale, { weekday: 'short' })
    const month = now.toLocaleDateString(locale, { month: 'short' })
    const dayNum = now.getMonth()
    return (
      <OrbitDockedPane name="home">
        <header>
          <title>
            <SubTitle $niceDate>
              {day} {month} {dayNum}
              <span $super>{postfix[dayNum - 1]}</span>
            </SubTitle>
          </title>
          <div $$flex />
        </header>
        <Masonry>
          {store.results.map((bit, index) => (
            <OrbitCard
              pane="summary"
              subPane="home"
              selectedTheme={selectedTheme}
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

  static style = {
    header: {
      padding: [0, 0, 5, 5],
    },
    niceDate: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: '1.5rem',
      margin: 0,
      padding: 0,
      flexFlow: 'row',
    },
    super: {
      verticalAlign: 'super',
      marginLeft: 1,
      fontSize: 11,
      opacity: 0.6,
    },
  }
}
