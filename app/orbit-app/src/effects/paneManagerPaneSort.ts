import { isEqual } from '@o/fast-compare'
import { useActiveClientApps, useActiveSpace } from '@o/kit'
import { AppBit, Space } from '@o/models'
import { keyBy, sortBy } from 'lodash'
import { useEffect } from 'react'

export function sortPanes(space: Space, apps: AppBit[]) {
  const appDict = keyBy(apps, 'id')

  let next = [
    ...new Set([
      // keep current sort
      ...space.paneSort.filter(id => appDict[id]),
      // newly added apps
      ...apps.map(x => x.id),
    ]),
  ]

  // ensure:
  //  1. editable at front
  //  2. pinned after that
  next = sortBy(next, id => {
    const a = appDict[id]
    return `${a.editable ? 1 : 0}${a.pinned ? 1 : 0}${a.id}`
  })

  return next
}

export function usePaneManagerPaneSort() {
  const activeApps = useActiveClientApps()
  const [space, updateSpace] = useActiveSpace()

  useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      const nextPaneSort = sortPanes(space, activeApps)
      console.log('setting pane sort', nextPaneSort)
      if (!isEqual(nextPaneSort, space.paneSort)) {
        updateSpace({ paneSort: nextPaneSort })
      }
    },
    [space && space.paneSort, activeApps.map(x => x.pinned).join('')],
  )
}
