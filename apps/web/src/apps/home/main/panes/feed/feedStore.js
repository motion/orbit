import { watch } from '@mcro/black'
import { Event } from '~/app'
import { format } from 'date-fns'
import { includes, debounce, without } from 'lodash'

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

export default class FeedStore {
  filters = {
    type: null,
    search: '',
    startDate: null,
    endDate: null,
    people: [],
  }

  brushDomain = null
  setBrush = debounce(domain => {
    this.brushDomain = domain
    this.setFilter('startDate', +new Date(domain.x[0]))
    this.setFilter('endDate', +new Date(domain.x[1]))
  }, 20)

  types = [
    { name: 'recently', type: null, icon: 'list' },
    { name: 'github', icon: 'github' },
    { name: 'slack', type: 'convo', icon: 'slack' },
    { name: 'docs', icon: 'hard' },
    { name: 'jira', icon: 'atl' },
  ]

  get firstNames() {
    return this.filters.people.map(x => x.replace(/ .*/, ''))
  }

  get result() {
    console.log(
      'FeedStore this.props.stackItem.sidebarSelected',
      this.props.stackItem.sidebarSelected
    )
    if (this.props.stackItem.sidebarSelected.parent) {
      console.log('123', this.props.stackItem.sidebarSelected.parent)
      return this.props.stackItem.sidebarSelected.parent
    }
    return this.props.stackItem.sidebarSelected
  }

  get data() {
    return this.result.data
  }

  @watch
  events = () =>
    Event.find({ created: { $ne: null } })
      .sort({ created: 'desc' })
      .limit(200)

  willMount() {
    const { people, person } = this.data
    this.setFilter(people ? people : [person])

    this.react(
      () => this.data.people,
      () => {
        this.setFilter('people', people)
      },
      true
    )

    this.react(
      () => this.data.service,
      () => {
        const { service, startDate, endDate } = this.data
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
        this.props.homeStore.filters = this.filters
      }
    )

    this.react(
      () => this.activeItems.length,
      () => {
        this.props.homeStore.resultCount = this.activeItems.length
      }
    )
  }

  get currentLogins() {
    return this.filters.people.map(name => nameToLogin[name])
  }

  get titleDesc() {
    const { type } = this.filters
    return `${this.activeItems.length} ${(type || 'item') + 's'}`
  }

  get titleSubdesc() {
    const { startDate, endDate } = this.filters
    if (!startDate || !endDate) {
      return ''
    }
    const fmt = ts => format(new Date(ts), 'MMM Do')
    return `${fmt(startDate)} - ${fmt(endDate)}`
  }

  get allItems() {
    return this.events || []
  }

  get results() {
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
    if (this.allActive) {
      return this.allItems
    }
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

  get activeItems() {
    const { filters: { startDate, endDate } } = this
    const val = this.currentChart.filter(item => {
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
    return val
  }

  setFilter = (key, val) => {
    this.filters = {
      ...this.filters,
      [key]: val,
    }
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

  createdAt = item => {
    return item.date
      ? +new Date(item.date)
      : +new Date(item.created || item.data.createdAt || item.date.created_at)
  }
}
