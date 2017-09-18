import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '../pane'
import * as React from 'react'
import { range, capitalize, sample, includes, random } from 'lodash'
import { Motion, spring } from 'react-motion'

const dayIndex = (row, col) => row * 7 + col - 4
const dotColors = [[64, 146, 240, 1], [163, 131, 236, 1], [242, 203, 70, 1]]
const dots = range(100).map(() =>
  range(random(0, 2)).map(() => sample(dotColors))
)

const getActiveDots = (row, index) => dots[dayIndex(row, index) + 20]

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
              <item $$row>
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
  render({ activeRow, activeCol, onSelect, isSmall }) {
    const days = 'sun,mon,tue,wed,thu,fri,sat'
      .split(',')
      .map(d => capitalize(d))
    const dayNumber = (row, col) => {
      const index = dayIndex(row, col)
      if (index < 1) return 29 + index
      if (index > 30) return index - 30
      return index
    }

    const isThisMonth = (row, col) => {
      const index = dayIndex(row, col)
      return index > 0 && index < 31
    }

    const allWeeks = 4
    const rows = isSmall ? range(1, 3) : range(0, allWeeks)

    return (
      <cal>
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
              {range(days.length).map((item, index) => (
                <item
                  key={index}
                  $visibleDay={includes(rows, row)}
                  $dark={includes(rows, row) && !isThisMonth(row, index)}
                  onClick={() => {
                    onSelect(row, index)
                  }}
                >
                  <highlight $lit={row === activeRow && index === activeCol}>
                    <UI.Text>{dayNumber(row, index)}</UI.Text>
                    <dots $$row>
                      {getActiveDots(row, index).map(background => (
                        <dot key={index} css={{ background }} />
                      ))}
                    </dots>
                  </highlight>
                </item>
              ))}
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
    dark: {
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
    visibleDay: {
      opacity: 1,
      transform: { scale: 1 },
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
  activeRow = 2
  activeCol = 2

  onSelect = (row, col) => {
    this.activeRow = row
    this.activeCol = col
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

@view.attach('millerStore')
@view({
  store: CalendarPaneStore,
})
export default class CalendarPane {
  render({ store, isSmall, millerStore, isActive }) {
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

    return (
      <UI.Theme name="clear-dark">
        <Pane.Card isActive={isActive} actions={actions}>
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
                activeRow={store.activeRow}
                activeCol={store.activeCol}
                isSmall={isSmall}
              />
              <RightList
                dots={getActiveDots(store.activeRow, store.activeCol)}
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
