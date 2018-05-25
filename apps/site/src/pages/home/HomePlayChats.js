import * as React from 'react'
import { view, react } from '@mcro/black'
import Trail from '~/trail'
import { Keyframes, Spring, animated, config, interpolate } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.esm'
import { chats, messages } from './stageItems'

class PlayChatsStore {
  runAnimation = react(
    () => this.props.animate,
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
    this.chatsRest(Spring, {
      to: { opacity: 0 },
      config: config.fast,
    })
    await this.chats(Trail, {
      from: { opacity: 0, y: -25 },
      to: { opacity: 1, y: 0 },
      config: { tension: 20, friction: 5 },
      delay: [10, 900, 900, 900, 900, 800, 500, 400, 400, 300, 500, 200].slice(
        0,
        chats.length,
      ),
    })
    this.animateChatsAway(sleep)
    await sleep(8000)
    this.chatsRest(Spring, {
      impl: TimingAnimation,
      config: {
        delay: 0,
        duration: 3500,
        easing: Easing.easeIn,
      },
      to: { opacity: 1 },
    })
  }

  animateChatsAway = async sleep => {
    await sleep(3800)
    await this.chatFrame(Spring, {
      impl: TimingAnimation,
      config: {
        delay: 0,
        duration: 4000,
        easing: Easing.easeOut,
      },
      to: { scale: 0.6, opacity: 0.6, y: -200 },
    })
    await sleep(200)
    this.chatFrame(Spring, {
      to: { scale: 0.6, opacity: 0, y: -550 },
      config: { tension: 4, friction: 80 },
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
                      `translate3d(0,${y + 110}px,0) scale(${scale})`,
                  ),
                }}
              >
                <Keyframes
                  native
                  keys={chats.map((_, i) => i)}
                  script={next => (store.chats = next)}
                >
                  {chats.map(chat => ({ y, opacity }) => (
                    <animated.div
                      style={{
                        opacity,
                        transform: y.interpolate(y => `translate3d(0,${y}%,0)`),
                      }}
                    >
                      {chat}
                    </animated.div>
                  ))}
                </Keyframes>
                <Keyframes native script={next => (store.chatsRest = next)}>
                  {({ opacity }) => (
                    <animated.div
                      style={{
                        opacity: opacity,
                        height: 500,
                      }}
                    >
                      {messages}
                    </animated.div>
                  )}
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
      right: '5%',
      left: '5%',
      bottom: 0,
      justifyContent: 'flex-start',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
  }
}
