import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '../pane'
import * as React from 'react'
import { range, capitalize, random, sample } from 'lodash'

class CalendarStore {
  activeRow = 2
  activeCol = 2

  dotColors = [[64, 146, 240, 1], [163, 131, 236, 1], [242, 203, 70, 1]]
  dots = range(100).map(() =>
    range(random(0, 2)).map(() => sample(this.dotColors))
  )

  select(row, col) {
    this.activeRow = row
    this.activeCol = col
  }
}

@view({
  store: CalendarStore,
})
class Calendar {
  render({ store }) {
    const days = 'sun,mon,tue,wed,thu,fri,sat'
      .split(',')
      .map(d => capitalize(d))
    const dayIndex = (row, col) => row * 7 + col - 4
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

    const rows = 5
    return (
      <cal>
        <days $$row>
          {days.map(day => (
            <item $dayItem>
              <day>
                <UI.Text>{day}</UI.Text>
              </day>
            </item>
          ))}
        </days>
        <rows>
          {range(rows).map(row => (
            <row $$row>
              {range(days.length).map((item, index) => (
                <item
                  $dark={!isThisMonth(row, index)}
                  onClick={() => {
                    store.select(row, index)
                  }}
                >
                  <highlight
                    $lit={row === store.activeRow && index === store.activeCol}
                  >
                    <UI.Text>{dayNumber(row, index)}</UI.Text>
                    <dots $$row>
                      {store.dots[dayIndex(row, index) + 20].map(background => (
                        <dot css={{ background }} />
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
      // background: 'rgba(26,36,50,0.8)',
      width: '100%',
      padding: [5, 20],
      borderRadius: 10,
    },
    day: {
      fontWeight: 400,
      margin: 5,
      opacity: 0.7,
    },
    item: {
      margin: 5,
      flex: 1,
      fontWeight: 500,
      fontSize: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    highlight: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      width: 60,
      height: 60,
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
      height: 40,
    },
    row: {},
  }
}

@view({
  store: class NewEventStore {
    text = ''
  },
})
class NewEvent {
  render({ store, onClose }) {
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
  highlightEventIndex = -1
}

@view.attach('millerState')
@view({
  store: CalendarPaneStore,
})
export default class CalendarPane {
  render({ store, millerState, isActive }) {
    const actions = [
      {
        name: 'newEvent',
        popover: props => <NewEvent {...props} />,
      },
    ]

    const events = [
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

    return (
      <UI.Theme name="clear-dark">
        <Pane.Card isActive={isActive} actions={actions}>
          <container>
            <titleContainer $$row>
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
                    millerState.runAction('newEvent')
                  }}
                  className="target-newEvent"
                  icon="simple-add"
                >
                  New Event
                </UI.Button>
              </actions>
            </titleContainer>
            <content>
              <Calendar />
              <bottom>
                <events>
                  {events.map((event, index) => (
                    <event
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
    titleContainer: {
      justifyContent: 'space-between',
      margin: [10, 0],
      alignItems: 'center',
    },
    input: {
      fontSize: 18,
    },
    content: {
      alignItems: 'center',
      margin: [10, 20],
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
