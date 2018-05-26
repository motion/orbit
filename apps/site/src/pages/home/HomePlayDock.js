import * as React from 'react'
import CountUp from 'react-countup'
import { view, react, deep } from '@mcro/black'
import * as Icons from '~/views/icons'
import * as Constants from '~/constants'
import { dockIcons } from './stageItems'

const distanceFromBottom = '20%'
const transform = {
  // scale: 0.9,
}

const Badge = view('div', {
  position: 'absolute',
  top: -5,
  right: -5,
  width: 24,
  height: 24,
  background: 'red',
  color: '#fff',
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: -1,
  boxShadow: '0 0 5px rgba(0,0,0,0.5)',
  transform: {
    scale: 1.2,
  },
})

const Count = ({ active, ...props }) =>
  active ? <CountUp {...props} /> : props.start

const CountBadge = props =>
  props.active === 1 ? (
    <Badge>{props.end}</Badge>
  ) : props.active ? (
    <Badge>
      <Count {...props} />
    </Badge>
  ) : null

class DockPlayStore {
  bounce = deep({
    slack: false,
    dropbox: false,
    mail: false,
    drive: false,
    github: false,
  })
  leave = deep({
    slack: false,
    dropbox: false,
    mail: false,
    drive: false,
    github: false,
  })

  runAnimation = react(
    () => this.props.animate && !this.props.hasAnimated,
    async (shouldAnimate, { sleep }) => {
      if (!shouldAnimate) throw react.cancel
      this.animateIcons(sleep)
    },
  )

  animateIcons = async sleep => {
    const bounceIcons = async () => {
      this.bounce.slack = true
      await sleep(4000)
      this.bounce.dropbox = true
      await sleep(200)
      this.bounce.mail = true
      this.bounce.drive = true
      await sleep(300)
      this.bounce.github = true
    }
    const leaveIcons = async () => {
      this.leave.dropbox = true
      await sleep(200)
      this.leave.mail = true
      this.leave.drive = true
      await sleep(300)
      this.leave.github = true
      await sleep(1000)
      this.leave.slack = true
    }
    await sleep(1000)
    bounceIcons()
    await sleep(6000)
    this.bounce.slack = 2
    this.bounce.dropbox = 2
    this.bounce.mail = 2
    this.bounce.drive = 2
    this.bounce.github = 2
    await sleep(3000)
    leaveIcons()
  }
}

@view({
  store: DockPlayStore,
})
export class HomePlayDock extends React.Component {
  render({ store }) {
    const dom = this.glossElement.bind(this)
    return (
      <>
        <dockContain
          css={{
            opacity: store.leave.slack ? 0 : 1,
          }}
        >
          <dockFrame>
            <dockFade />
          </dockFrame>
        </dockContain>
        <dockIcons>
          {dockIcons.map(({ name, size, countProps }) => {
            const Icon = Icons[`${name}Icon`]
            const bounce = store.bounce[name.toLowerCase()]
            const leave = store.leave[name.toLowerCase()]
            const countHigher = bounce === 2
            const badge = (
              <CountBadge
                active={bounce}
                {...countProps}
                start={countHigher ? countProps.end : countProps.start}
                end={countProps.end * (countHigher ? 2 : 1)}
              />
            )
            return dom(Icon, {
              key: name,
              $icon: true,
              $bouncy: bounce,
              $leave: leave,
              size,
              after: badge,
            })
          })}
        </dockIcons>
      </>
    )
  }

  static style = {
    dockContain: {
      position: 'absolute',
      bottom: distanceFromBottom,
      right: 0,
      left: 0,
      background: `linear-gradient(transparent, ${Constants.rightBg})`,
      zIndex: 200,
      transition: 'all ease-out 1000ms',
      transform,
    },
    dockFrame: {
      position: 'absolute',
      bottom: 15,
      right: '2%',
      left: '2%',
      background: [255, 255, 255, 0.07],
      borderTopRadius: 10,
      padding: [0, 20, 10],
      height: 100,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      border: [1, [255, 255, 255, 0.1]],
      transformOrigin: 'top center',
      transform: {
        scale: 0.9,
      },
    },
    dockFade: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: -10,
      background: `linear-gradient(transparent, ${Constants.rightBg})`,
    },
    dockIcons: {
      transform,
      position: 'absolute',
      bottom: `calc(${distanceFromBottom} + 35px)`,
      left: '5%',
      right: '5%',
      height: 120,
      zIndex: 201,
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      padding: [0, 15],
      flexFlow: 'row',
      overflow: 'hidden',
    },
    bouncy: {
      transition: 'all ease-in 100ms',
      animation: 'bounceIn 3s',
      transformOrigin: 'center bottom',
    },
    icon: {
      transition: 'all ease-in 400ms',
    },
    leave: {
      opacity: 0,
      transform: {
        y: 50,
      },
    },
  }
}
