// @flow
import * as React from 'react'
import { view, watch, Component } from '@mcro/black'
import { Event, Thing } from '~/app'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/panes/pane'
import type { PaneProps } from '~/types'
import Calendar from './calendar'
import moment from 'moment'
import FeedItem from './views/feedItem'
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
  show = false

  componentDidMount() {
    this.setTimeout(() => {
      this.show = true
    }, 200)
  }

  render({ store }) {
    // YO - this is taking 300ms to render
    // and breaks if you return null for a frame for some reason

    if (!this.show) {
      return null
    }
    log('debug')
    const things = store.currentChart
    if (things.length === 0) return <div />
    const chartStyle = { parent: { minWidth: '80%' } }
    console.time('')
    const values = weeks(things.map(itemStamp))

    return (
      <chart>
        <VictoryChart
          padding={{ top: 0, left: 0, right: 0, bottom: 30 }}
          width={500}
          height={90}
          scale={{ x: 'time' }}
          style={chartStyle}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              dimension="x"
              onDomainChange={store.setBrush}
              style={{
                tickLabels: {
                  fontSize: 15,
                  color: 'red',
                  fill: 'blue',
                  padding: 5,
                },
              }}
            />
          }
        >
          <VictoryBar
            style={{
              data: { fill: '#75a9f3' },
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

class SetStore {
  props: PaneProps
  isOpen = false
  filters = {
    type: null,
    startDate: null,
    endDate: null,
  }
  brushDomain = null

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
    { name: 'docs', icon: 'hard' },
    { name: 'jira', icon: 'atl' },
    { name: 'tasks', type: 'task', icon: 'github' },
  ]
  people = []

  get currentLogins() {
    return this.people.map(name => nameToLogin[name])
  }

  toggleLogin = login => {
    const name = loginToName[login]
    this.people = includes(this.people, name)
      ? without(this.people, name)
      : [...this.people, name]
  }

  willMount() {
    const { people, person } = this.props.paneStore.data
    this.people = people ? people : [person]

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
  }

  get searchDesc() {
    const { type, startDate, endDate } = this.filters
    const format = ts => moment(new Date(ts)).format('MMM Do')
    const time =
      startDate &&
      endDate &&
      `between ${format(startDate)} and ${format(endDate)}`
    return `${this.activeItems.length} ${(type || 'item') + 's'} ${time || ''}`
  }

  things = Thing.find()

  @watch
  events: ?Array<Event> = (() =>
    Event.find({ created: { $ne: null } })
      .sort({ created: 'asc' })
      .limit(20): any)

  get allItems() {
    return [...(this.events || []), ...(this.things || [])]
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
    const { filters: { type } } = this
    if (this.allActive) return this.allItems
    return this.allItems.filter(item => {
      if (type && (item.type || item.name) !== type) {
        return false
      }

      if (item.type === 'task') {
        if (
          this.hasPeople &&
          !includes(
            this.currentLogins,
            item.data.author && item.data.author.login
          )
        ) {
          return false
        }
      } else {
        if ((this.hasPeople, !includes(this.currentLogins, item.author))) {
          return false
        }
      }

      return true
    })
  }

  get hasPeople() {
    return this.people.length > 0
  }

  get activeItems() {
    const { filters: { search, startDate, endDate } } = this

    // console.time('calculating active items')

    const val = this.currentChart
      .filter(item => {
        const itemDate = item.date
          ? +new Date(item.date)
          : +new Date(item.data.createdAt || item.data.created_at)

        if (
          startDate &&
          endDate &&
          (itemDate < startDate || itemDate > endDate)
        ) {
          return false
        }

        if (search && item.title.indexOf(search) === -1) return false

        return true
      })
      .reverse()

    // console.timeEnd('calculating active items')

    return val
  }
}

type Props = PaneProps & { store: SetStore }

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

@view({
  store: SetStore,
})
export default class SetView extends Component<Props> {
  render({ store, paneStore }: Props) {
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
      {
        view: () => (
          <section $$row>
            {store.people.map((person, index) => (
              <person key={index} $$row css={{ marginRight: 20 }}>
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
        view: () => <ItemsSection store={store} />,
      },
      {
        view: () => (
          <info
            style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
          >
            <UI.Title size={1.2}>{store.searchDesc}</UI.Title>
            <Chart store={store} />
            1234
          </info>
        ),
      },
      {
        view: () => (
          <section if={store.calendarActive} css={{ width: '100%' }}>
            <div
              $$row
              css={{
                width: '100%',
                alignItems: 'flex-start',
                maxHeight: '100%',
              }}
            >
              1236
              <Calendar isSmall={!store.calendarActive} />
            </div>
          </section>
        ),
      },
      ...store.activeItems.map(item => ({
        view: () => <FeedItem store={store} event={item} />,
      })),
    ]

    return (
      <div style={{ flex: 1 }}>
        123
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
