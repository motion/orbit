// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event, Thing } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps } from '~/types'
import Calendar from '../calendar'
import moment from 'moment'
import FeedItem from '../views/feedItem'
import {
  capitalize,
  includes,
  isUndefined,
  debounce,
  groupBy,
  sortBy,
  without,
} from 'lodash'
import { VictoryChart, VictoryBrushContainer, VictoryBar } from 'victory'
import getConvos from './helpers'

const itemStamp = item => +new Date(item.data.createdAt || item.data.created_at)
const weeks = stamps => {
  const groups = groupBy(
    stamps,
    stamp => +new Date(moment(+new Date(stamp)).startOf('isoWeek'))
  )

  return sortBy(Object.keys(groups)).map(stamp => ({
    x: new Date(+stamp),
    y: groups[stamp].length,
  }))
}

@view
class Chart {
  render({ store }) {
    const things = store.currentChart
    if (things.length === 0) return <div />
    const chartStyle = {
      border: '1px solid orange',
    }
    const values = weeks(things.map(itemStamp))

    return (
      <chart>
        <VictoryChart
          padding={{ top: 0, left: 0, right: 0, bottom: 20 }}
          width={600}
          height={60}
          scale={{ x: 'time' }}
          style={chartStyle}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              dimension="x"
              onDomainChange={store.setBrush}
            />
          }
        >
          <VictoryBar
            style={{
              data: { fill: '#7697ff' },
            }}
            data={values}
          />
        </VictoryChart>
      </chart>
    )
  }

  static style = {
    chart: {
      flex: 1,
      marginTop: 10,
    },
  }
}

const nameToLogin = {
  nate: 'natew',
  me: 'natew',
  nick: 'ncammarata',
  steel: 'steelbrain',
}

const loginToName = Object.keys(nameToLogin).reduce(
  (acc, name) => ({
    [nameToLogin[name]]: name,
    ...acc,
  }),
  {}
)

class FeedStore {
  props: PaneProps
  isOpen = false
  filters = {
    type: null,
    search: '',
    startDate: null,
    endDate: null,
    people: [],
  }

  brushDomain = null
  convos = []

  setBrush = debounce(domain => {
    this.brushDomain = domain
    this.setFilter('startDate', +new Date(domain.x[0]))
    this.setFilter('endDate', +new Date(domain.x[1]))
  }, 20)

  setFilter = (key, val) => {
    this.filters = {
      ...this.filters,
      [key]: val,
    }
  }

  types = [
    { name: 'all', type: null, icon: false },
    { name: 'calendar', icon: 'cal' },
    { name: 'github', icon: 'github' },
    { name: 'slack', type: 'convo', icon: 'slack' },
    { name: 'docs', icon: 'hard' },
    { name: 'jira', icon: 'atl' },
    { name: 'tasks', type: 'task', icon: 'github' },
  ]

  get currentLogins() {
    return this.filters.people.map(name => nameToLogin[name])
  }

  toggleLogin = login => {
    this.togglePerson(loginToName[login])
  }

  togglePerson = name => {
    console.log('toggling person', name)
    this.setFilter(
      'people',
      includes(this.filters.people, name)
        ? without(this.filters.people, name)
        : [...this.filters.people, name]
    )
  }

  fetchSlack = async () => {
    const data = await (await fetch('/slack.json')).json()
    this.convos = getConvos(data)
    window._convos = this.convos
  }

  willMount() {
    const { people, person } = this.props.paneStore.data
    this.setFilter(people ? people : [person])
    this.fetchSlack()

    this.react(
      () => this.props.paneStore.data.people,
      () => {
        this.setFilter('people', people)
      },
      true
    )

    this.react(
      () => this.props.paneStore.data.service,
      () => {
        const { service, startDate, endDate } = this.props.paneStore.data
        this.setFilter(
          'type',
          (service === 'issues' ? 'task' : service) || null
        )
        if (startDate) {
          this.setFilter('startDate', +new Date(startDate))
        }

        if (endDate) {
          this.setFilter('endDate', +new Date(endDate))
        }
      },
      true
    )

    this.react(
      () => this.filters,
      () => {
        this.props.barStore.filters = this.filters
      }
    )

    this.react(
      () => this.activeItems.length,
      () => {
        this.props.barStore.resultCount = this.activeItems.length
      }
    )
  }

  get titleDesc() {
    const { type } = this.filters
    return `${this.activeItems.length} ${(type || 'item') + 's'}`
  }

  get titleSubdesc() {
    const { startDate, endDate } = this.filters
    if (!startDate || !endDate) return ''

    const format = ts => moment(new Date(ts)).format('MMM Do')

    return `${format(startDate)} - ${format(endDate)}`
  }

  things = Thing.find()

  @watch
  events: ?Array<Event> = (() =>
    Event.find({ created: { $ne: null } })
      .sort({ created: 'desc' })
      .limit(20): any)

  get allItems() {
    return [...(this.events || []), ...(this.things || []), ...this.convos]
  }

  get results(): Array<Event> {
    return this.activeItems.map(i => ({ ...i, showChild: false }))
  }

  get calendarActive() {
    return this.allActive || this.filters.type === 'calendar'
  }

  get allActive() {
    return this.filters.type === null
  }

  // separated so chart can use it
  get currentChart() {
    const { filters: { type, search } } = this

    if (this.allActive) return this.allItems

    return this.allItems.filter(item => {
      if (type && (item.type || item.name) !== type) {
        return false
      }

      const itemAuthors = item.authors || [item.author]

      if (item.type === 'task') {
        if (
          this.hasPeople &&
          !includes(this.currentLogins, item.data.author.login)
        ) {
          return false
        }
      } else {
        if (
          this.hasPeople &&
          itemAuthors.filter(author => includes(this.filters.people, author))
            .length === 0
        ) {
          return false
        }
      }

      if (
        search.length > 0 &&
        (item.title || item.data.text || '').indexOf(search) === -1
      ) {
        return false
      }

      return true
    })
  }

  get hasPeople() {
    return this.filters.people.length > 0
  }

  createdAt = item => {
    return item.date
      ? +new Date(item.date)
      : +new Date(item.data.createdAt || item.data.created_at)
  }

  get activeItems() {
    const { filters: { startDate, endDate } } = this

    const val = this.currentChart
      .filter(item => {
        const itemDate = this.createdAt(item)

        if (
          startDate &&
          endDate &&
          (itemDate < startDate || itemDate > endDate)
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => this.createdAt(b) - this.createdAt(a))

    console.timeEnd('calculating active items')

    return val
  }
}

type Props = PaneProps & { store: FeedStore }

@view
class ItemsSection {
  render({ store }) {
    return (
      <UI.Row
        spaced
        itemProps={{ size: 1, borderWidth: 0, glint: false }}
        css={{ justifyContent: 'space-between' }}
      >
        {store.types.map(type => (
          <UI.Button
            key={type}
            icon={type.icon}
            highlight={
              (isUndefined(type.type) ? type.name : type.type) ===
              store.filters.type
            }
            onClick={() => {
              store.setFilter(
                'type',
                isUndefined(type.type) ? type.name : type.type
              )
            }}
          >
            {capitalize(type.name)}
          </UI.Button>
        ))}
      </UI.Row>
    )
  }
}

@view.attach('barStore')
@view({
  store: FeedStore,
})
export default class SetView extends Component<Props> {
  render({ store }: Props) {
    // return <h4>team page</h4>
    if (!store.allItems.length) {
      return (
        <div $$padded>
          <UI.FakeText lines={5} />
        </div>
      )
    }

    const avatar = s => `/images/${s === 'nate' ? 'me' : s}.jpg`

    const items = [
      false && {
        height: 75,
        view: () => (
          <section $$row>
            {store.filters.people.map(person => (
              <person $$row css={{ marginRight: 20 }}>
                <img $image src={avatar(person)} />
                <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                  {person}
                </UI.Title>
              </person>
            ))}
          </section>
        ),
      },
      {
        height: 60,
        view: () => <ItemsSection store={store} />,
      },
      {
        view: () => (
          <info css={{ marginLeft: 30 }}>
            <chart className="chart">
              <Chart store={store} />
            </chart>
          </info>
        ),
      },
      false &&
        store.filters.type === 'calendar' && {
          view: () => (
            <section
              if={store.filters.type === 'calendar'}
              css={{ width: '100%' }}
            >
              <div
                $$row
                css={{
                  width: '100%',
                  alignItems: 'flex-start',
                  maxHeight: '100%',
                }}
              >
                <Calendar isSmall={!store.calendarActive} />
              </div>
            </section>
          ),
        },
      ...store.activeItems.map(item => ({
        view: () => <FeedItem store={store} event={item} />,
      })),
    ].filter(i => i)

    return (
      <div style={{ flex: 1 }}>
        <Pane.Card
          itemProps={{
            glow: false,
          }}
          items={items}
        />
      </div>
    )
  }

  static style = {
    section: {
      padding: [8, 10],
      justifyContent: 'center',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 1000,
      margin: 'auto',
      marginRight: 10,
    },
  }
}
