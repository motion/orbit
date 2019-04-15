import { react, useStore } from '@o/kit'
import React from 'react'
import { useSiteStore } from '../../Layout'

const duration = 2000

type ShownState = boolean | 'animating'

class SpaceStore {
  props: { show: boolean }

  shown: ShownState = react(
    () => this.props.show,
    async (next, { sleep, setValue }) => {
      setValue('animating')
      await sleep(next ? 100 : duration)
      return next
    },
  )
}

export function OuterSpace(props) {
  const store = useStore(SpaceStore, props)
  const siteStore = useSiteStore()

  if (store.shown === false) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: siteStore.sectionHeight,
        opacity: props.show ? 0.5 : 0,
        zIndex: -1,
        pointerEvents: 'none',
        transition: `all  ease ${duration}ms`,
        ...props,
      }}
    >
      <iframe style={{ border: 0, height: '100%' }} src="/public/stars.html" />
    </div>
  )
}
