import * as React from 'react'
import { view, react } from '@mcro/black'
import { DurationTrail } from '~/trail'
import { Keyframes, Spring, animated, config, interpolate } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons'
import { chats, messages } from './stageItems'

class PlayChatsStore {
  runAnimation = react(
    () => this.props.animate && !this.props.hasAnimated,
    async (shouldAnimate, { sleep }) => {
      if (!shouldAnimate) throw react.cancel
      this.animateChats(sleep)
    },
  )

  animateChats = async sleep => {
    this.chatFrame(Spring, {
      from: { scale: 1, opacity: 0, opacityRest: 0, y: 0 },
      to: { scale: 1, opacity: 1, opacityRest: 0, y: 0 },
    })
    await sleep(800)
    await this.chats(DurationTrail, {
      delays: [
        0,
        800,
        400,
        600,
        200,
        100,
        200,
        250,
        150,
        200,
        300,
        150,
        250,
        100,
        250,
        300,
      ],
      delay: 0,
      ms: 200,
      from: { opacity: 0, y: -25 },
      to: { opacity: 1, y: 0 },
      config: { tension: 20, friction: 5 },
    })
    this.animateChatsAway(sleep)
  }

  animateChatsAway = async sleep => {
    await this.chatFrame(Spring, {
      impl: TimingAnimation,
      config: {
        delay: 0,
        duration: 2500,
        easing: Easing.easeOut,
      },
      to: { scale: 0.6, opacity: 0.6, y: -700 },
    })
    await sleep(200)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 0, y: -1100 },
      config: { tension: 6, friction: 50 },
    })
  }
}

@view({
  store: PlayChatsStore,
})
export class HomePlayChats extends React.Component {
  render({ store }) {
    return (
      <chats>
        <Keyframes native script={next => (store.chatFrame = next)}>
          {({ scale, opacity, y }) => {
            return (
              <animated.div
                style={{
                  opacity,
                  transform: interpolate(
                    [scale, y],
                    (scale, y) =>
                      `translate3d(0,${y + 210}px,0) scale(${scale})`,
                  ),
                }}
              >
                <Keyframes
                  native
                  keys={chats.map((_, i) => i)}
                  script={next => (store.chats = next)}
                >
                  {chats.map((chat, index) => ({ y, opacity }) => (
                    <animated.div
                      key={index}
                      style={{
                        opacity,
                        transform: y.interpolate(y => `translate3d(0,${y}%,0)`),
                      }}
                    >
                      {chat}
                    </animated.div>
                  ))}
                </Keyframes>
              </animated.div>
            )
          }}
        </Keyframes>
      </chats>
    )
  }

  static style = {
    chats: {
      position: 'absolute',
      top: 0,
      right: '8%',
      left: '8%',
      bottom: 0,
      justifyContent: 'flex-start',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
  }
}
