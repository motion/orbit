import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '../pane'
import * as React from 'react'
import { range, capitalize, sample, includes, random } from 'lodash'
import moment from 'moment'

const dayIndex = (row, col) => row * 7 + col - 4
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const dotColors = [[64, 146, 240, 1], [163, 131, 236, 1], [242, 203, 70, 1]]
const dots = range(100).map(() =>
  range(random(0, 2)).map(() => sample(dotColors))
)
const months = 'Jan,Feb,Mar,Apr,May,Jun,July,Aug,Sep,Oct,Nov,Dec'.split(',')

const getActiveDots = (month, day) => dots[month + day + 20]

@view
class RightList extends React.Component<> {
  static defaultProps: {}

  render({ dots }) {
    const items = [
      {
        month: '12',
        day: '7',
        time: '7am',
        people: 'Jacob',
        description: 'IdeaDrive w/Search team',
      },
      {
        month: '12',
        day: '7',
        time: '10am',
        people: 'Steel',
        description: 'OKR Review w/James',
      },
      {
        month: '12',
        day: '7',
        time: '3pm',
        people: 'Steph and Nick',
        description: 'Planetary fundraiser',
      },
      {
        month: '12',
        day: '8',
        time: '8am',
        people: 'Steph',
        description: 'Q4 linkup review',
      },
      {
        month: '12',
        day: '8',
        people: 'Nick',
        time: '10:30am',
        description: '1on1 with Dave',
      },
    ]

    return (
      <list>
        <placeholder if={dots.length === 0}>
          <UI.Title size={2}>No Events</UI.Title>
        </placeholder>
        <content if={dots.length > 0}>
          {dots.map((background, index) => {
            const item = sample(items)

            return (
              <item $$row key={item.description}>
                <content>
                  {item.content || (
                    <UI.Button
                      $item
                      chromeless
                      icon={<dot css={{ marginTop: -13, background }} />}
                      if={!item.content}
                      height={50}
                      size={1.1}
                      key={index}
                      padding={[10, 20, 20, 10]}
                    >
                      <div
                        $description
                        css={{
                          marginTop: -15,
                          fontWeight: 400,
                          fontSize: item.description.length > 20 ? 14 : 16,
                        }}
                        $$row
                      >
                        {item.description}
                      </div>
                      <info
                        $date
                        css={{
                          flexFlow: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          $time
                          css={{
                            opacity: 0.5,
                          }}
                        >
                          <UI.Text size={1}>
                            {item.time}, {item.people}
                          </UI.Text>
                        </div>
                      </info>
                    </UI.Button>
                  )}
                </content>
                <UI.Icon
                  if={false}
                  size={12}
                  color="#eee"
                  $arrow
                  name="arrows-1_bold-right"
                />
              </item>
            )
          })}
        </content>
      </list>
    )
  }

  static style = {
    list: {
      width: 280,
      borderLeft: [1, [0, 0, 0, 0.1]],
      justifyContent: 'center',
      padding: [0, 0, 0, 10],
      margin: [0, 0, 0, 0],
    },
    item: {
      height: 60,
    },
    placeholder: {
      alignItems: 'center',
      justifySelf: 'center',
    },
    content: {},
    arrow: {
      marginLeft: 10,
      marginTop: 5,
      opacity: 0.7,
    },
    item: {
      marginLeft: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 10,
    },
    section: {
      padding: [8, 10],
    },
  }
}

@view
class Calendar {
  render({ store }) {
    const {
      onSelect,
      isSmall,
      visibleMonth,
      wrapMonth,
      activeDay,
      activeMonth,
      nextMonth,
      prevMonth,
    } = store
    const days = 'sun,mon,tue,wed,thu,fri,sat'
      .split(',')
      .map(d => capitalize(d))

    const norm = (row, col) => {
      const index = dayIndex(row, col)
      if (index < 1)
        return {
          day: daysInMonth[wrapMonth(visibleMonth - 1)] + index,
          month: wrapMonth(visibleMonth - 1),
        }
      if (index > daysInMonth[visibleMonth])
        return {
          day: index - daysInMonth[visibleMonth],
          month: wrapMonth(visibleMonth + 1),
        }

      return { day: index, month: visibleMonth }
    }

    const allWeeks = 5
    const rows = isSmall ? range(1, 3) : range(0, allWeeks)

    return (
      <cal>
        <actions if={!isSmall} $$row>
          <UI.Button $leftAction onClick={store.toToday} size={1.0} chromeless>
            Today
          </UI.Button>
          <UI.Button
            $leftAction
            size={1.0}
            chromeless
            onClick={prevMonth}
            icon="arrows-1_bold-left"
          />
          <UI.Button
            $leftAction
            size={1.0}
            onClick={nextMonth}
            chromeless
            icon="arrows-1_bold-right"
          />
          <UI.Title size={1.2}>{months[visibleMonth]}</UI.Title>
        </actions>
        <days $$row>
          {days.map(day => (
            <item $visibleDay $dayLabel key={day}>
              <day>
                <UI.Text ellipse>{day}</UI.Text>
              </day>
            </item>
          ))}
        </days>
        <rows>
          {range(0, allWeeks).map(row => (
            <row $visible={includes(rows, row)} key={row} $$row>
              {range(days.length).map((item, index) => {
                const { day: itemDay, month: itemMonth } = norm(row, index)

                return (
                  <item
                    key={'row' + row + 'index' + index}
                    $visibleDay={includes(rows, row)}
                    $dark={includes(rows, row) && itemMonth !== visibleMonth}
                    onClick={() => {
                      onSelect({ day: itemDay, month: itemMonth })
                    }}
                  >
                    <highlight
                      $lit={itemDay === activeDay && itemMonth === activeMonth}
                    >
                      <UI.Text>{itemDay + ''}</UI.Text>
                      <dots $$row>
                        {getActiveDots(
                          itemMonth,
                          itemDay
                        ).map((background, index) => (
                          <dot key={index} css={{ background }} />
                        ))}
                      </dots>
                    </highlight>
                  </item>
                )
              })}
            </row>
          ))}
        </rows>
      </cal>
    )
  }

  static style = {
    cal: {
      width: '100%',
      userSelect: 'none',
    },
    days: {
      borderBottom: [1, 'solid', [0, 0, 0, 0.05]],
    },
    day: {
      fontWeight: 400,
      margin: 5,
      opacity: 0.7,
    },
    item: {
      margin: 5,
      flex: 1,
      transform: { scale: 0.5 },
      transformOrigin: 'center center',
      opacity: 0,
      transition: 'all 150ms ease-in',
      fontWeight: 500,
      fontSize: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    highlight: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 38,
      minHeight: 38,
      borderRadius: 100,
      transition: 'background ease-in 50ms',
    },
    lit: {
      background: '#aaa',
    },
    dots: {
      marginTop: 3,
    },
    dot: {
      borderRadius: 100,
      marginRight: 2,
      marginLeft: 2,
      height: 5,
      width: 5,
    },
    visibleDay: {
      opacity: 1,
      transform: { scale: 1 },
    },
    dark: {
      color: 'rgba(0,0,0,0.3)',
      opacity: 0.5,
    },
    dayItem: {
      height: 25,
    },
    row: {
      // marginTop: 10,
      transition: 'all 150ms ease-in',
      height: 0,
    },
    visible: {
      height: 50,
    },
  }
}

@view({
  store: class NewEventStore {
    text = ''
  },
})
class NewEvent {
  render({ store, onCreate, onClose }) {
    return (
      <UI.Theme name="light">
        <newEvent>
          <UI.Input
            $input
            placeholder="Party at 2pm for an hour"
            size={1.2}
            autoFocus
            chromeless
            onChange={e => {
              store.text = e.target.value
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) onCreate(store.text)
              if (e.keyCode === 13 || e.keyCode === 27) onClose()
            }}
            value={store.text}
          />
          <UI.Text $info>September 20th</UI.Text>
        </newEvent>
      </UI.Theme>
    )
  }

  static style = {
    newEvent: {
      background: '#efefef',
      padding: 10,
    },
    input: {
      width: 300,
    },
    info: {
      marginLeft: 10,
    },
  }
}

@view
class Event {
  render({ name, details, highlight }) {
    return (
      <event $highlight={highlight}>
        <name $$row>
          <UI.Title $title size={1.2}>
            {name}
          </UI.Title>
          <UI.Icon $icon name="arrows-1_bold-right" color="#eee" size={12} />
        </name>
        <info>
          <UI.Text>{details}</UI.Text>
        </info>
      </event>
    )
  }

  static style = {
    event: {
      padding: [15, 20],
      transition: 'box-shadow ease-in 80ms',
    },
    highlight: {
      boxShadow: '1px 1px 5px rgba(0,0,0,.2)',
    },
    name: {
      alignItems: 'center',
    },
    icon: {
      marginLeft: 8,
      opacity: 0.6,
    },
    title: {
      textShadow: '1px 1px 1px rgba(0,0,0,.1)',
    },
    info: {
      opacity: 0.8,
    },
  }
}

class CalendarPaneStore {
  activeMonth = null
  activeDay = null
  visibleMonth = null

  get isSmall() {
    return this.props.isSmall
  }

  get startDate() {
    return this.props.paneStore && this.props.paneStore.data.startDate
  }

  setActive = () => {
    if (this.startDate) {
      const active = this.startDate
      this.activeDay = active.getDate()
      this.activeMonth = active.getMonth()
      this.visibleMonth = active.getMonth()
    }
  }

  start() {
    let active = new Date()
    if (this.startDate) {
      active = this.startDate
    }

    this.activeDay = active.getDate()
    this.activeMonth = active.getMonth()
    this.visibleMonth = active.getMonth()
  }

  toToday = () => {
    this.activeMonth = new Date().getMonth()
    this.activeDay = new Date().getDate()
    this.visibleMonth = this.activeMonth
  }

  prevMonth = () => {
    this.visibleMonth = this.wrapMonth(this.visibleMonth - 1)
  }

  nextMonth = () => {
    this.visibleMonth = this.wrapMonth(this.visibleMonth + 1)
  }

  wrapMonth = i => {
    if (i < 0) return 13 + i
    if (i > 12) return i - 13
    return i
  }

  onSelect = ({ day, month }) => {
    console.log('selecting', day, month)
    this.activeDay = day
    this.activeMonth = month
  }

  highlightEventIndex = -1
  events = [
    {
      name: `Flu shots in the office October 9`,
      details: `Next Friday we'll have a flu shot clinic in the office. It's available to all employees regardless of wheter you've previously`,
    },
    {
      name: `Please claim your giant stuffed animals`,
      details: `If you are the guardian of a stuffed bear spherical dog, please take it hope so that the humans`,
    },
    {
      name: `Office closed July 3`,
      details: `The San Francisco office will be closed Friday, July 3 for Independence day weekend`,
    },
  ]

  addEvent = event => (this.events = [...this.events, event])
}

const friendlyDate = ({ startDate, endDate }) => {
  const start = moment(startDate).calendar()
  if (endDate) {
    const end = moment(endDate).calendar()
    return `${start} - ${end}`
  }

  return start
}

@view.attach('millerStore')
@view({
  store: CalendarPaneStore,
})
export default class CalendarPane {
  componentWillReceiveProps() {
    this.props.store.setActive()
  }

  render({ store, isSmall, paneStore, millerStore, isActive }) {
    const actions = [
      {
        name: 'newEvent',
        popover: props => (
          <NewEvent
            onCreate={name => store.addEvent({ name, details: '' })}
            {...props}
          />
        ),
      },
    ]
    console.log('people are', paneStore && paneStore.data.people)

    return (
      <UI.Theme name="clear-dark">
        <Pane.Card isActive={isActive} actions={actions}>
          <section if={paneStore}>
            <people $$row>
              {paneStore.data.people.map(person => (
                <person $$row key={person}>
                  <img $image src={`/images/${person}.jpg`} />
                  <UI.Title onClick={store.ref('isOpen').toggle} size={2}>
                    {person}
                  </UI.Title>
                </person>
              ))}
            </people>
            <UI.Title
              css={{ padding: 20 }}
              size={1.2}
              if={paneStore.data.startDate}
            >
              {friendlyDate(paneStore.data).replace(/\ at\ 12\:00\ AM/g, '')}
            </UI.Title>
          </section>
          <container>
            <titleContainer if={false} $$row>
              <actions $$row>
                <UI.Button $leftAction size={1.0} chromeless>
                  Today
                </UI.Button>
                <UI.Button
                  $leftAction
                  size={1.0}
                  chromeless
                  icon="arrows-1_bold-left"
                />
                <UI.Button
                  $leftAction
                  size={1.0}
                  chromeless
                  icon="arrows-1_bold-right"
                />
              </actions>
              <UI.Title $title size={2}>
                Nick's Calendar
              </UI.Title>
              <actions>
                <UI.Button
                  size={1.0}
                  onClick={() => {
                    millerStore.runAction('newEvent')
                  }}
                  className="target-newEvent"
                  icon="simple-add"
                >
                  New Event
                </UI.Button>
              </actions>
            </titleContainer>
            <content $$row>
              <Calendar
                onSelect={store.onSelect}
                activeDots={dots}
                store={store}
              />
              <RightList
                dots={getActiveDots(store.activeMonth, store.activeDay)}
              />
              <bottom if={false}>
                <events>
                  {store.events.map((event, index) => (
                    <event
                      key={index}
                      onMouseEnter={() => (store.highlightEventIndex = index)}
                      onMouseLeave={() => (store.highlightEventIndex = null)}
                    >
                      <Event
                        highlight={index === store.highlightEventIndex}
                        {...event}
                      />
                    </event>
                  ))}
                </events>
              </bottom>
            </content>
          </container>
        </Pane.Card>
      </UI.Theme>
    )
  }

  static style = {
    content: {
      width: 420,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 1000,
      marginLeft: 20,
      marginRight: 10,
    },
    titleContainer: {
      justifyContent: 'space-between',
      margin: [10, 0],
      alignItems: 'center',
    },
    input: {
      fontSize: 18,
    },
    leftAction: {
      marginLeft: 3,
      marginRight: 3,
    },
    actions: {
      alignSelf: 'flex-end',
      margin: [0, 45],
    },
    bottom: {
      flex: 1,
      alignItems: 'center',
    },
    events: {
      flex: 1,
      width: '80%',
      marginTop: 10,
      borderRadius: 3,
      background: 'rgba(16,144,255,0.7)',
      boxShadow: '1px 1px 5px rgba(0,0,0,.1)',
    },
  }
}
