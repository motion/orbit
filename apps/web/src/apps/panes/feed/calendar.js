import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'

const VERTICAL_PADDING = 25
const ROW_HEIGHT = 45
const ROW_PAD = 2
const HOUR_WIDTH = window.innerWidth / 5
const START_HOUR = 8.5
const EVENT_BORDER_WIDTH = 3
const CURRENT_TIME = 9

const hourOffset = hour => hour - START_HOUR
const colors = ['#226322', '#8c3030', '#30308c', '#ffb357']
const rc = () => colors[Math.floor((colors.length - 1) * Math.random())]

@view({
  calendarStore: class CalendarStore {
    @watch
    events = () =>
      Event.find()
        .where('created')
        .gte(new Date().toISOString())
        .limit(100)
  },
})
export default class Calendar {
  render({ calendarStore, labels }) {
    return (
      <calendar>
        <labels>
          {labels.map((label, i) => (
            <lbl $color={colors[i]} key={label}>
              {label} <lblSq $bg={colors[i]} />
            </lbl>
          ))}
        </labels>
        <calendarRow $calendarHeight={2}>
          <controls $$row>
            <UI.Theme name="dark">
              <UI.Row>
                <UI.Button size={0.8} icon="arrowminleft" sizePadding={1} />
                <UI.Button size={0.8}>Jan 12th</UI.Button>
                <UI.Button size={0.8} icon="arrowminright" sizePadding={1} />
              </UI.Row>
              <div css={{ marginRight: 10 }} />
              <UI.Row if={false}>
                <UI.Button size={0.9} fontWeight={800} color={[0, 0, 0, 0.5]}>
                  Day
                </UI.Button>
                <UI.Button size={0.9} color={[0, 0, 0, 0.4]}>
                  Week
                </UI.Button>
              </UI.Row>
            </UI.Theme>
          </controls>
          <currentTime $atTime={CURRENT_TIME}>
            <dot />
          </currentTime>
          <events>
            <event $color={rc()} $atTime={9} $hours={0.5} $offset={1}>
              <title>Standup</title>
            </event>
            <event $color={rc()} $atTime={9.5} $hours={0.5} $offset={1}>
              <title>Call with Seth</title>
            </event>
            <event $color={rc()} $atTime={10} $hours={2} $offset={1}>
              <title>All Hands Q4</title>
              <sub $$ellipse>Something or other</sub>
            </event>
            <event $color={rc()} $atTime={11} $hours={2} $offset={2}>
              <title>Product Page Launch Celebration</title>
              <sub $$ellipse>Something or other</sub>
            </event>
            <event $color={rc()} $atTime={13} $offset={1}>
              <title>Meet carol</title>
              <sub $$ellipse>Something or other</sub>
            </event>
            <event if={false} $color={rc()} $atTime={14} $offset={2}>
              <title>Meet carol</title>
              <sub $$ellipse>Something or other</sub>
            </event>
            <event if={false} $color={rc()} $atTime={14} $hours={2}>
              <title>Meet carol</title>
              <sub $$ellipse>Something or other</sub>
            </event>
            <event $color={rc()} $atTime={16} $offset={1}>
              <title>Meet carol</title>
              <sub $$ellipse>Something or other</sub>
            </event>
            <event $color={rc()} $atTime={17} $offset={1}>
              <title>Meet carol</title>
              <sub $$ellipse>Something or other</sub>
            </event>
          </events>
          <period>
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(time => (
              <mark key={time} $atTime={time} $bold={time === 12} />
            ))}
          </period>
          <hours>
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(time => (
              <UI.Text $hourMark $bold={time === 12} key={time} $atTime={time}>
                {time === 12 ? 12 : time % 12}
                {time >= 12 ? 'pm' : 'am'}
              </UI.Text>
            ))}
          </hours>
        </calendarRow>
      </calendar>
    )
  }

  static style = {
    calendar: {
      flex: 1,
      maxWidth: '100%',
    },
    calendarRow: {
      position: 'relative',
      flex: 1,
      borderTop: [1, [0, 0, 0, 0.08]],
      borderBottom: [1, [0, 0, 0, 0.08]],
    },
    calendarHeight: rows => ({
      height: (ROW_HEIGHT + ROW_PAD) * rows + VERTICAL_PADDING * 2,
    }),
    offset: x => ({
      top: ROW_HEIGHT * x - ROW_PAD * x - VERTICAL_PADDING / 2,
    }),
    color: color => ({
      borderColor: UI.color(color).lightness(70),
      background: UI.color(color).lightness(95),
      color,
    }),
    bg: background => ({
      background,
    }),
    labels: {
      flexFlow: 'row',
      paddingRight: 350,
      paddingLeft: 25,
      '&:hover > .lbl': {
        filter: 'none',
        opacity: 1,
      },
    },
    lbl: {
      padding: [0, 10],
      flex: 1,
      opacity: 0.5,
      filter: 'grayscale(100%) brightness(99.999%)',
    },
    controls: {
      position: 'absolute',
      bottom: -5,
      right: -15,
      zIndex: 100,
    },
    currentTime: {
      width: 3,
      background: '#7c50d2',
      bottom: 2,
      top: 0,
      position: 'absolute',
      zIndex: 11,
    },
    dot: {
      width: 9,
      height: 9,
      marginLeft: -5,
      bottom: -8,
      position: 'absolute',
      left: '50%',
      right: 0,
      alignItems: 'center',
      borderRadius: 1000,
      background: '#7c50d2',
    },
    atTime: hour => ({
      position: 'absolute',
      left: hourOffset(hour) * HOUR_WIDTH,
    }),
    events: {
      position: 'absolute',
      top: 1,
      left: 0,
      right: 0,
      bottom: 1,
      zIndex: 10,
    },
    event: {
      width: HOUR_WIDTH,
      height: ROW_HEIGHT - ROW_PAD - EVENT_BORDER_WIDTH,
      color: '#fff',
      padding: [3, 4],
      lineHeight: '15px',
      overflow: 'hidden',
      borderRadius: 4,
      borderBottom: [EVENT_BORDER_WIDTH, 'transparent'],
    },
    title: {
      margin: [1, 0],
      fontSize: 16,
      lineHeight: '15px',
      fontWeight: 400,
      overflow: 'hidden',
      maxHeight: '100%',
    },
    sub: {
      fontSize: '80%',
      opacity: 0.5,
    },
    hours: x => ({
      width: HOUR_WIDTH * x,
    }),
    period: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 8,
    },
    mark: {
      bottom: 0,
      top: 0,
      width: 1,
      borderRight: [1, 'dotted', [255, 255, 255, 0.3]],
      opacity: 0.75,
    },
    hourMark: {
      opacity: 0.5,
      top: 0,
      padding: [0, 0, 0, 5],
      fontSize: 13,
      width: 100,
      borderColor: 'transparent',
    },
    bold: {
      fontWeight: 600,
      opacity: 0.8,
      borderRightStyle: 'solid',
      borderWidth: 2,
    },
  }
}
