import { App, Space } from '@mcro/models'
import { isEqual } from 'lodash'
import { useEffect } from 'react'
import { useActiveApps } from './useActiveApps'
import { useActiveSpace } from './useActiveSpace'

function sortPanes(space: Space, apps: App[]) {
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
  const missingInA = !!a.filter(aID => b.indexOf(aID) === -1).length
  const missingInB = !!b.filter(bID => a.indexOf(bID) === -1).length
  return missingInA || missingInB
}

export function useManagePaneSort() {
  // TODO @umed why do i have to pass undefined here to get just the App[] type?
  // if you take off undefined you'll see the bug, see useActiveApps for bad type defs
  const activeApps = useActiveApps(undefined)
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
