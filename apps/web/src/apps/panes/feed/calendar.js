import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const HOUR_WIDTH = 85
const START_HOUR = 9

const hourOffset = hour => hour - START_HOUR
const colors = ['darkgreen', 'darkred', 'darkblue', 'darkorange', 'darkpurple']
const rc = () => colors[Math.floor(colors.length * Math.random())]

@view
export default class Calendar {
  render() {
    return (
      <calendar>
        <fadeRight
          css={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 200,
            //background: 'linear-gradient(to right, transparent, #fff 90%)',
            zIndex: 1000,
          }}
        />
        <controls $$row>
          <UI.Row>
            <UI.Button size={0.9} color={[0, 0, 0, 0.3]} icon="arrowminleft" />
            <UI.Button size={0.9}>Jan 12th</UI.Button>
            <UI.Button size={0.9} color={[0, 0, 0, 0.3]} icon="arrowminright" />
          </UI.Row>
          <div css={{ marginRight: 10 }} />
          <UI.Row>
            <UI.Button size={0.9} fontWeight={800}>
              Day
            </UI.Button>
            <UI.Button size={0.9}>Week</UI.Button>
          </UI.Row>
        </controls>
        <currentTime $atTime={11}>
          <dot />
        </currentTime>
        <events>
          <event $$background={rc()} $atTime={10} $hours={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={11} $hours={2} $offset={1}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={11} $hours={2} $offset={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={13} $offset={1}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={14} $offset={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={14} $hours={2}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={16}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
          <event $$background={rc()} $atTime={17}>
            <title>Meet carol</title>
            <sub $$ellipse>Something or other</sub>
          </event>
        </events>
        <period>
          {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(time => (
            <mark key={time} $atTime={time} />
          ))}
        </period>
        <hours>
          {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(time => (
            <hourMark key={time} $atTime={time}>
              {time % 12}
              {time > 12 ? 'pm' : 'am'}
            </hourMark>
          ))}
        </hours>
      </calendar>
    )
  }

  static style = {
    calendar: {
      height: 166,
      position: 'relative',
      borderTop: [1, '#eee'],
      borderBottom: [1, '#eee'],
      margin: [0, -20, 8],
      flex: 1,
    },
    controls: {
      position: 'fixed',
      top: -13,
      left: 20,
      zIndex: 100,
    },
    currentTime: {
      width: 4,
      background: 'black',
      bottom: 5,
      top: 0,
      position: 'absolute',
      zIndex: 12,
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.1]]],
    },
    dot: {
      width: 12,
      height: 12,
      marginLeft: -6,
      position: 'absolute',
      bottom: -12,
      left: '50%',
      right: 0,
      alignItems: 'center',
      borderRadius: 1000,
      background: 'black',
    },
    atTime: hour => ({
      position: 'absolute',
      border: '10px red',
      left: hourOffset(hour) * HOUR_WIDTH,
    }),
    events: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      top: 22,
    },
    event: {
      width: HOUR_WIDTH,
      height: 38,
      background: 'green',
      color: '#fff',
      padding: [5, 10],
      borderRadius: 6,
      lineHeight: '14px',
    },
    title: {
      margin: [1, 0],
    },
    sub: {
      fontSize: '80%',
      opacity: 0.5,
    },
    offset: x => ({
      top: 40 * x,
    }),
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
      background: [0, 0, 0, 0.05],
    },
    hourMark: {
      color: '#000',
      opacity: 0.3,
      bottom: -2,
      padding: [0, 0, 0, 5],
      fontSize: 12,
      fontWeight: 600,
    },
  }
}
