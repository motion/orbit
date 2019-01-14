import * as React from 'react'
import { react } from '@mcro/black'
import { now } from 'mobx-utils'
import { View } from '@mcro/ui'
import { gloss } from '@mcro/gloss'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'

class BlurryStore {
  guys = [[-40, -40], [50, -20], [0, 60]]

  update = react(
    () => now(3000),
    () => {
      this.guys = this.guys.map(x =>
        x.map(y =>
          Math.min(100, Math.max(-20, y + Math.random() * 50 * (Math.random() > 0.5 ? -1 : 1))),
        ),
      )
    },
  )
}

const colors = ['rebeccapurple', 'green', 'orange']

const Blur = gloss(View, {
  width: 200,
  height: 200,
  margin: [-100, 0, 0, -100],
  filter: 'blur(50px)',
  opacity: 0.7,
  transition: 'all ease 6000ms',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: {
    x: 0,
    y: 0,
  },
}).theme(({ at }) => {
  return {
    transform: {
      x: `${at[0]}%`,
      y: `${at[1]}%`,
    },
  }
})

export default observer(function BlurryGuys() {
  const store = useStore(BlurryStore)
  return (
    <>
      {store.guys.map((guy, index) => {
        return <Blur key={index} at={guy} background={colors[index]} opacity={0.15} />
      })}
    </>
  )
})
