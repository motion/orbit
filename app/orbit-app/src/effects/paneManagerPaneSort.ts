import { useActiveClientApps, useActiveSpace } from '@o/kit'
import { AppBit, Space } from '@o/models'
import { isEqual } from 'lodash'
import { useEffect } from 'react'

function sortPanes(space: Space, apps: AppBit[]) {
  let pinned = []
  let unpinned = []
  for (const id of space.paneSort) {
    const app = apps.find(x => x.id === id)
    if (!app) {
      continue
    }
    if (app.pinned) {
      pinned.push(id)
    } else {
      unpinned.push(id)
    }
  }
  return [...new Set([...pinned, ...unpinned])]
}

function hasDifference(a: number[], b: number[]) {
  const missingInA = !!a.filter(aID => !b.includes(aID)).length
  const missingInB = !!b.filter(bID => !a.includes(bID)).length
  return missingInA || missingInB
}

export function usePaneManagerPaneSort() {
  const activeApps = useActiveClientApps()
  const [space, updateSpace] = useActiveSpace()
  const paneSort = (space && space.paneSort) || []
  const hasMismatchedIds = hasDifference(paneSort, activeApps.map(x => x.id))

  // Sync activeApps <=> paneSort
  useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      if (activeApps[0].spaceId !== space.id) {
        return
      }
      if (hasMismatchedIds) {
        const nextPaneSort = [
          // ensure unique
          ...new Set([
            // keep good ones
            ...paneSort.filter(x => !!activeApps.find(a => a.id === x)),
            // add the rest
            ...activeApps.map(x => x.id),
          ]),
        ]
        updateSpace({ paneSort: nextPaneSort })
        return
      }
    },
    [space && space.id, activeApps.map(x => x.id).join(''), hasMismatchedIds],
  )

  // move pinned apps to the front
  useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      const isNotSameLen = space.paneSort.length !== activeApps.length
      // only update if we have matching paneSort
      if (isNotSameLen) {
        return
      }
      const nextPaneSort = sortPanes(space, activeApps)
      if (!isEqual(nextPaneSort, space.paneSort)) {
        updateSpace({ paneSort: nextPaneSort })
      }
    },
    [space && space.paneSort.join(''), activeApps.map(x => x.pinned).join('')],
  )
}
