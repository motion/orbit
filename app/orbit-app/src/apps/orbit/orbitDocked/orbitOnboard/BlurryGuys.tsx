import * as React from 'react'
import { view, react } from '@mcro/black'
import { now } from 'mobx-utils'
import { View } from '@mcro/ui'

class BlurryStore {
  guys = [[-40, -40], [50, -20], [0, 60]]

  update = react(
    () => now(3000),
    () => {
      this.guys = this.guys.map(x =>
        x.map(y =>
          Math.min(80, Math.max(-20, y + Math.random() * 50 * (Math.random() > 0.5 ? -1 : 1))),
        ),
      )
    },
  )
}

const colors = ['rebeccapurple', 'green', 'orange']

const Blur = view(View, {
  width: 200,
  height: 200,
  margin: [-100, 0, 0, -100],
  filter: 'blur(50px)',
  transition: 'all ease 3000ms',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: {
    x: 0,
    y: 0,
  },
})
Blur.theme = ({ at }) => {
  return {
    transform: {
      x: `${at[0]}%`,
      y: `${at[1]}%`,
    },
  }
}

@view.attach({
  store: BlurryStore,
})
@view
export class BlurryGuys extends React.Component<{ store?: BlurryStore }> {
  render() {
    const { store } = this.props
    return store.guys.map((guy, index) => {
      return <Blur key={index} at={guy} background={colors[index]} opacity={0.15} />
    })
  }
}
