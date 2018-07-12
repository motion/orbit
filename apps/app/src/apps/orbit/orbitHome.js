import * as React from 'react'
import { view, react, attachTheme } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Bit, Person } from '@mcro/models'
import { SubTitle } from '../../views'
import { OrbitCard } from './orbitCard'
import { Masonry } from '../../views/Masonry'
import { OrbitDockedPane } from './orbitDockedPane'

// css={{
//   opacity: index > 3 ? (total / index / total) * 3 : 1,
// }}

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
    where: {
      type,
      integration,
    },
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
  })

class OrbitHomeStore {
  setGetResults = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      this.props.appStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  get isActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  results = modelQueryReaction(
    async () => {
      console.time('homeSearch')
      const result = await Promise.all([
        // { type: 'team', title: 'Engineering' },
        findType('slack', 'conversation', 2),
        findType('github', 'task', 1),
        findType('slack', 'conversation', 4),
        findType('gdocs', 'document'),
        Person.findOne({ name: 'Andrew Hsu' }),
        Person.findOne({ name: 'Nick Bovee' }),
        // limit due to slowness for now
        findType('confluence', 'document'),
        findType('jira', 'document'),
        findType('gmail', 'mail'),
        // findType('gmail', 'mail', 1),
        // findType('gdocs', 'document', 9),
        // findType('slack', 'conversation', 5),
        // findType('slack', 'conversation', 6),
        // findType('slack', 'conversation', 7),
        // findType('slack', 'conversation', 8),
      ])
      console.timeEnd('homeSearch')
      return result.filter(Boolean)
    },
    {
      defaultValue: [],
      poll: 60 * 1000,
    },
  )
}

const selectedTheme = { color: 'rgb(34.3%, 26.9%, 54.2%)', background: '#fff' }
const itemProps = {
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
}

@attachTheme
@view.attach({
  store: OrbitHomeStore,
})
@view
export class OrbitHome extends React.Component {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render({ store }) {
    // log('HOME---------------')
    const locale = 'en-US'
    const now = new Date()
    const day = now.toLocaleDateString(locale, { weekday: 'short' })
    const month = now.toLocaleDateString(locale, { month: 'short' })
    const dayNum = now.getMonth()
    const total = store.results.length
    return (
      <OrbitDockedPane name="home" fadeBottom>
        <header if={false}>
          <SubTitle>
            {day} {month} {dayNum}
            <span
              css={{
                verticalAlign: 'super',
                marginLeft: 1,
                fontSize: 11,
                opacity: 0.6,
              }}
            >
              {postfix[dayNum - 1]}
            </span>
          </SubTitle>
          <div $$flex />
        </header>
        <content>
          <Masonry if={total}>
            {store.results.map((bit, index) => {
              const isExpanded = index < 2
              return (
                <OrbitCard
                  pane="summary"
                  subPane="home"
                  selectedTheme={selectedTheme}
                  key={`${bit.id}${index}`}
                  index={index}
                  bit={bit}
                  total={total}
                  isExpanded={false && isExpanded}
                  style={isExpanded && this.span2}
                  itemProps={itemProps}
                >
                  {false &&
                    isExpanded &&
                    (({ content }) => (
                      <inner css={{ margin: [6, 0] }}>{content}</inner>
                    ))}
                </OrbitCard>
              )
            })}
          </Masonry>
        </content>
      </OrbitDockedPane>
    )
  }
}
