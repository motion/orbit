import { isDefined, useActiveSpace } from '@o/kit'
import { arrayMove } from '@o/react-sortable-hoc'
import { useCallback } from 'react'

export function useAppSortHandler() {
  const [space, updateSpace] = useActiveSpace()
  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      let paneSort = arrayMove([...(space.paneSort || [])], oldIndex, newIndex)
      // bug fix we had multiple of the same, we need to figure out why this can happen though...
      paneSort = [...new Set<number>(paneSort)].filter(isDefined)
      // update
      updateSpace(space => {
        console.log('ok now lets finish sorting.......', [...space.paneSort!], [...paneSort])
        space.paneSort = paneSort
      })
    },
    [space, updateSpace],
  )
  return handleSortEnd
}
