import { View } from '@o/ui'
import { react, useStore } from '@o/use-store'
import { FullScreen, gloss } from 'gloss'
import { now } from 'mobx-utils'
import * as React from 'react'

class BlurryStore {
  guys = [[-40, -40], [50, -20], [0, 60]]
  isVisible = false

  handleRef(ref) {
    new IntersectionObserver(
      entries => {
        this.isVisible = entries.some(e => e.isIntersecting)
        console.log('is visible', this.isVisible)
      },
      {
        root: ref,
      },
    )
  }

  update = react(
    () => this.isVisible && now(3000),
    () => {
      this.guys = this.guys.map(x =>
        x.map(y =>
          Math.min(100, Math.max(-20, y + Math.random() * 50 * (Math.random() > 0.5 ? -1 : 1))),
        ),
      )
    },
    {
      lazy: true,
    },
  )
}

const colors = ['rebeccapurple', 'green', 'orange']

const Blur = gloss<any>(View, {
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

export default function BlurryGuys() {
  const store = useStore(BlurryStore)
  return (
    <FullScreen ref={store.handleRef}>
      {store.guys.map((guy, index) => {
        return <Blur key={index} at={guy} background={colors[index]} opacity={0.15} />
      })}
    </FullScreen>
  )
}
