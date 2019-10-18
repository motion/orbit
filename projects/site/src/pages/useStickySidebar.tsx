import { useDebounce } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { useEffect, useLayoutEffect, useRef } from 'react'
import StickySidebar from 'sticky-sidebar'

export function useStickySidebar({ condition = true, id, ...rest }) {
  const forceUpdate = useForceUpdate()
  const forceUpdateSlow = useDebounce(forceUpdate, 100)

  useEffect(() => {
    let last
    window.addEventListener(
      'resize',
      () => {
        if (window.innerHeight !== last) {
          forceUpdateSlow()
        }
        last = window.innerHeight
      },
      { passive: true },
    )
    return () => window.removeEventListener('resize', forceUpdateSlow)
  })

  useEffect(() => {
    if (condition === false) {
      return
    }
    let sidebar
    setTimeout(() => {
      sidebar = new StickySidebar(id, {
        topSpacing: 0,
        bottomSpacing: 0,
        innerWrapperSelector: '.sidebar__inner',
        stickyClass: 'is-affixed',
        minWidth: 0,
        resizeSensor: true,
        ...rest,
      })
    }, 20)
    return () => {
      sidebar && sidebar.destroy()
    }
  }, [])
}
