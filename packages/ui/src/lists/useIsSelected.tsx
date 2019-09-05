import { useReaction } from '@o/use-store'

import { ListItemSimpleProps } from './ListItemViewProps'

export function useIsSelected(props: Pick<ListItemSimpleProps, 'isSelected' | 'index'>) {
  return useReaction(
    () => {
      if (typeof props.isSelected === 'function') {
        return props.isSelected(props.index)
      }
      return !!props.isSelected
    },
    {
      name: 'ListItem|Card.isSelected',
      priority: 2,
    },
    [props.isSelected],
  )
}
