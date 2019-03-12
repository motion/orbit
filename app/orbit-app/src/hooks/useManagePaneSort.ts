import { useActiveClientApps, useActiveSpace } from '@o/kit'
import { AppBit, Space } from '@o/models'
import { isEqual, keyBy } from 'lodash'
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
  next = next.sort((a, b) =>
    appDict[a].editable === false ? -1 : appDict[a].pinned && !appDict[b].pinned ? 1 : -1,
  )

  return next
}

export function useManagePaneSort() {
  const activeApps = useActiveClientApps()
  const [space, updateSpace] = useActiveSpace()

  useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      const nextPaneSort = sortPanes(space, activeApps)
      if (!isEqual(nextPaneSort, space.paneSort)) {
        updateSpace({ paneSort: nextPaneSort })
      }
    },
    [space && space.paneSort, activeApps.map(x => x.pinned).join('')],
  )
}
