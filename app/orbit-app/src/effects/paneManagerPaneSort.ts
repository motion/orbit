import { isEqual } from '@o/fast-compare'
import { useActiveClientApps, useActiveSpace } from '@o/kit'
import { AppBit, Space } from '@o/models'
import { keyBy, sortBy } from 'lodash'
import { useEffect } from 'react'

const tabDisplaySort = {
  permanent: 0,
  pinned: 1,
  plain: 2,
}

export function sortPanes(space: Space, apps: AppBit[]) {
  const appDict = keyBy(apps, 'id')

  let next = [
    ...new Set([
      // keep current sort, remove deleted
      ...space.paneSort.filter(id => appDict[id]),
      // add new
      ...apps.filter(x => x.tabDisplay !== 'hidden').map(x => x.id),
    ]),
  ]

  // ensure:
  //  1. editable at front
  //  2. pinned after that
  //  3. stable sort after that
  next = sortBy(next, id => {
    const a = appDict[id]
    return `${tabDisplaySort[a.tabDisplay]}${a.id}`
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
      if (!isEqual(paneSort, space.paneSort)) {
        console.log('setting pane sort', paneSort)
        updateSpace({ paneSort })
      }
    },
    [space, activeApps],
  )
}
