import { useActiveSpace } from '@o/kit'
import { arrayMove } from '@o/react-sortable-hoc'

export function useAppSortHandler() {
  const [space, updateSpace] = useActiveSpace()

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    let paneSort = arrayMove([...space.paneSort], oldIndex, newIndex)

    // bug fix we had multiple of the same, we need to figure out why this can happen though...
    paneSort = [...new Set(paneSort)]

    // update
    updateSpace(space => {
      space.paneSort = paneSort
    })
  }

  return handleSortEnd
}
