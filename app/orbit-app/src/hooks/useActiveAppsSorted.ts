import { differenceWith, isEqual } from 'lodash'
import { useEffect } from 'react'
import { useActiveApps } from './useActiveApps'
import { useActiveSpace } from './useActiveSpace'

export function useActiveAppsSorted() {
  const activeApps = useActiveApps()
  const [space, updateSpace] = useActiveSpace()
  const hasMismatchedIds =
    activeApps.length &&
    space &&
    !!differenceWith((space && space.paneSort) || [], activeApps.map(x => x.id), isEqual).length

  // keep apps in sync with paneSort
  // TODO: this can be refactored into useSyncSpacePaneOrderEffect
  //       but we should refactor useObserve/useModel first so it re-uses
  //       identical queries using a WeakMap so we dont have tons of observes...
  useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      if (!space.paneSort) {
        updateSpace({ paneSort: activeApps.map(x => x.id) })
        return
      }
      if (activeApps[0].spaceId !== space.id) {
        return
      }
      if (hasMismatchedIds) {
        console.log('are mismatched', space.paneSort, activeApps.map(x => x.id))
        updateSpace({ paneSort: activeApps.map(x => x.id) })
        return
      }
    },
    [space && space.id, activeApps.map(x => x.id).join(''), hasMismatchedIds],
  )

  if (!activeApps || !space) {
    return []
  }
  return space.paneSort.map(id => activeApps.find(x => x.id === id)).filter(Boolean)
}
