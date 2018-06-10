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
    () => [this.props.paneStore.activePane === this.props.name, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      this.props.appStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  results = react(
    async () => {
      return (await Promise.all([
        // { type: 'team', title: 'Engineering' },
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

const selectedTheme = { color: 'rgb(34.3%, 26.9%, 54.2%)', background: '#fff' }

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
          <SubTitle>
            {day} {month} {dayNum}
            <span $super>{postfix[dayNum - 1]}</span>
          </SubTitle>
          <div $$flex />
        </header>
        <Masonry>
          {store.results.map((bit, index) => {
            const expanded = index < 2
            return (
              <OrbitCard
                pane="summary"
                subPane="home"
                selectedTheme={selectedTheme}
                key={`${bit.id}${index}`}
                index={index}
                bit={bit}
                total={store.results.length}
                hoverToSelect
                expanded={expanded}
                style={expanded && this.span2}
                itemProps={{
                  shownLimit: 3,
                  contentStyle: {
                    maxHeight: '1.2rem',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 18,
                    opacity: 0.8,
                    margin: [5, 0],
                  },
                }}
              >
                {false &&
                  expanded &&
                  (({ content }) => (
                    <inner css={{ margin: [6, 0] }}>{content}</inner>
                  ))}
              </OrbitCard>
            )
          })}
        </Masonry>
      </OrbitDockedPane>
    )
  }

  static style = {
    super: {
      verticalAlign: 'super',
      marginLeft: 1,
      fontSize: 11,
      opacity: 0.6,
    },
  }
}
