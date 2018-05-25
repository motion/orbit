import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Keyframes, Spring, animated, config } from 'react-spring'
import Router from '~/router'
import * as Constants from '~/constants'

class PlayMessagesStore {
  runAnimation = react(
    () => this.props.animate,
    async (shouldAnimate, { sleep }) => {
      if (!shouldAnimate) throw react.cancel
      this.animate(sleep)
    },
  )

  animate = async sleep => {
    await sleep(5000)
    await sleep(1500)
    await this.chatText(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
    })
    await sleep(700)
    this.chatText(Spring, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      config: config.slow,
    })
    await sleep(1000)
    await this.chatText2(Spring, {
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: config.slow,
    })
  }
}

@view({
  store: PlayMessagesStore,
})
export class HomePlayMessages extends React.Component {
  render({ store }) {
    return (
      <>
        <Keyframes native script={next => (store.chatText = next)}>
          {({ opacity }) => (
            <animated.div style={{ opacity }}>
              <message>
                <msgBlur if={false} />
                Incoming overload?
              </message>
            </animated.div>
          )}
        </Keyframes>
        <Keyframes native script={next => (store.chatText2 = next)}>
          {({ opacity }) => (
            <animated.div style={{ opacity }}>
              <message>
                <msgBlur />
                Stay in sync, stress free.
                <UI.Row
                  if={false}
                  spaced
                  itemProps={{
                    size: 1.1,
                    alpha: 0.8,
                  }}
                  css={{
                    flexFlow: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: [20, 0, 0],
                  }}
                >
                  <UI.Button
                    icon="refresh"
                    tooltip="Replay"
                    onClick={store.restart}
                  />
                  <UI.Button onClick={Router.link('/features')}>
                    Features
                  </UI.Button>
                  <UI.Button onClick={Router.link('/use-cases')}>
                    Use Cases
                  </UI.Button>
                </UI.Row>
              </message>
            </animated.div>
          )}
        </Keyframes>
      </>
    )
  }

  static style = {
    message: {
      // color: '#fff',
      fontWeight: 200,
      fontSize: 36,
      lineHeight: '50px',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 100,
      zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      pointerEvents: 'auto',
    },
    msgBlur: {
      zIndex: -1,
      position: 'absolute',
      alignSelf: 'center',
      // display: 'flex',
      content: ' ',
      width: '60%',
      height: '40%',
      background: Constants.rightBg,
      filter: {
        blur: 125,
      },
    },
  }
}
