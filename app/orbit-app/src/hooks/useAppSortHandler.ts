import { isDefined, useActiveSpace } from '@o/kit'
import { arrayMove } from '@o/react-sortable-hoc'
import { useCallback } from 'react'

export function useAppSortHandler() {
  const [space, updateSpace] = useActiveSpace()
  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      // update
      updateSpace(space => {
        let paneSort = arrayMove([...(space.paneSort || [])], oldIndex, newIndex)
        // bug fix we had multiple of the same, need to figure out why this happens...
        paneSort = [...new Set<number>(paneSort)].filter(isDefined)
        console.warn('ok now lets finish sorting.......', [...space.paneSort!], [...paneSort])
        space.paneSort = paneSort
      })
    },
    [space, updateSpace],
  )
  return handleSortEnd
}
