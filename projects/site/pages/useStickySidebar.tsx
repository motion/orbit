import { useDebounce } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { useEffect, useLayoutEffect, useRef } from 'react'
import StickySidebar from 'sticky-sidebar'

export function useStickySidebar({ condition = true, id, ...rest }) {
  const forceUpdate = useForceUpdate()
  const forceUpdateSlow = useDebounce(forceUpdate, 100)

  useEffect(() => {
    window.addEventListener('resize', forceUpdateSlow)
    return () => window.removeEventListener('resize', forceUpdateSlow)
  })

  useLayoutEffect(() => {
    if (condition === false) {
      return
    }
    const sidebar = new StickySidebar(id, {
      topSpacing: 0,
      bottomSpacing: 0,
      innerWrapperSelector: '.sidebar__inner',
      stickyClass: 'is-affixed',
      minWidth: 0,
      resizeSensor: true,
      ...rest,
    })
    return () => {
      sidebar.destroy()
    }
  }, [])
}
