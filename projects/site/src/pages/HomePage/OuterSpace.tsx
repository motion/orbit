import React from 'react'

import { useSiteStore } from '../../SiteStore'

const duration = 1500

// type ShownState = boolean | 'animating'

// class SpaceStore {
//   props: { show: boolean }

//   shown: ShownState = react(
//     () => this.props.show,
//     async (next, { sleep, setValue }) => {
//       setValue('animating')
//       await sleep(next ? 0 : duration)
//       return next
//     },
//   )
// }

export function OuterSpace(props) {
  const siteStore = useSiteStore()

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: siteStore.sectionHeight,
        opacity: 0.25,
        zIndex: -1,
        pointerEvents: 'none',
        transition: `all  ease ${duration}ms`,
        ...props,
      }}
    >
      <iframe
        title="Animated stars bg"
        style={{ border: 0, height: '100%' }}
        src={process.env.NODE_ENV === 'development' ? '/public/stars.html' : '/stars.html'}
      />
    </div>
  )
}
