import { isEqual } from '@o/fast-compare'
import { useActiveClientApps, useActiveSpace } from '@o/kit'
import { AppBit, Space } from '@o/models'
import { keyBy, sortBy } from 'lodash'
import { useEffect } from 'react'

export function sortPanes(space: Space, apps: AppBit[]) {
  const appDict = keyBy(apps, 'id')

  let next = [
    ...new Set([
      // keep current sort, remove deleted
      ...space.paneSort.filter(id => appDict[id]),
      // add new
      ...apps.map(x => x.id),
    ]),
  ]

  // ensure:
  //  1. editable at front
  //  2. pinned after that
  //  3. stable sort after that
  next = sortBy(next, id => {
    const a = appDict[id]
    return `${a.editable ? 0 : 1}${a.pinned ? 0 : 1}${a.id}`
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
      const paneSort = sortPanes(space, activeApps)
      console.log('setting pane sort', paneSort)
      if (!isEqual(paneSort, space.paneSort)) {
        updateSpace({ paneSort })
      }
    },
    [space, activeApps],
  )
}
