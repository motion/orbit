import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
// import { Pattern } from '~/views'

const VERTICAL_PADDING = 42
const ROW_HEIGHT = 50
const ROW_PAD = 5
const HOUR_WIDTH = 75
const START_HOUR = 8.5
const EVENT_BORDER_WIDTH = 3
const CURRENT_TIME = 9

const hourOffset = hour => hour - START_HOUR
const colors = ['#226322', '#8c3030', '#30308c', '#ffb357']
const rc = () => colors[Math.floor((colors.length - 1) * Math.random())]

@view
export default class Calendar {
  render() {
    return (
      <calendar $calendarHeight={2}>
        <controls $$row>
          <UI.Theme name="light">
            <UI.Row>
              <UI.Button
                size={0.9}
                color={[0, 0, 0, 0.3]}
                icon="arrowminleft"
                sizePadding={1}
              />
              <UI.Button size={0.9} color={[0, 0, 0, 0.8]}>
                Jan 12th
              </UI.Button>
              <UI.Button
                size={0.9}
                color={[0, 0, 0, 0.3]}
                icon="arrowminright"
                sizePadding={1}
              />
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
          <fadeRight
            css={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 100,
              background: 'linear-gradient(to right, transparent, #fff 90%)',
              zIndex: 1000,
            }}
          />
        </period>
        <hours>
          {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(time => (
            <UI.Text $hourMark $bold={time === 12} key={time} $atTime={time}>
              {time === 12 ? 12 : time % 12}
              {time >= 12 ? 'pm' : 'am'}
            </UI.Text>
          ))}
        </hours>
      </calendar>
    )
  }

  static style = {
    calendar: {
      position: 'relative',
      flex: 1,
      // borderBottom: [1, [0, 0, 0, 0.04]],
    },
    calendarHeight: rows => ({
      height: ROW_HEIGHT * rows + VERTICAL_PADDING,
    }),
    offset: x => ({
      top: (ROW_HEIGHT - ROW_PAD) * x - VERTICAL_PADDING / 2,
    }),
    controls: {
      position: 'absolute',
      top: -10,
      right: 20,
      zIndex: 100,
    },
    currentTime: {
      width: 3,
      background: '#ccc',
      bottom: 5,
      top: 0,
      position: 'absolute',
      zIndex: 9,
    },
    dot: {
      width: 11,
      height: 11,
      marginLeft: -6,
      position: 'absolute',
      bottom: -10,
      left: '50%',
      right: 0,
      alignItems: 'center',
      borderRadius: 1000,
      background: '#ccc',
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
    },
    color: color => ({
      borderBottom: [EVENT_BORDER_WIDTH, color],
      background: UI.color(color).lightness(95),
      color,
    }),
    title: {
      margin: [1, 0],
      fontSize: 15,
      fontWeight: 400,
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
      // background: 'linear-gradient(#eee, transparent)',
      borderRight: '1px dotted #ddd',
      opacity: 0.75,
    },
    hourMark: {
      opacity: 0.5,
      bottom: 0,
      padding: [0, 0, 0, 5],
      fontSize: 13,
      //fontWeight: 600,
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
