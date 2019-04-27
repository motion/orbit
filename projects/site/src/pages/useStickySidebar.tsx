import { useLayoutEffect } from 'react'
import StickySidebar from 'sticky-sidebar'

export function useStickySidebar({ condition = true, id, ...rest }) {
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
  }, [screen])
}
