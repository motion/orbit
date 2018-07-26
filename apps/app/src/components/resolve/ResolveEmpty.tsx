import { AppStatePeekItem } from '../../../../stores/App'
import { EMPTY_ITEM } from '../../constants'

export const ResolveEmpty = ({
  item = EMPTY_ITEM,
  children,
}: {
  item: AppStatePeekItem
  children: Function
}) =>
  children({
    ...EMPTY_ITEM,
    ...item,
  })
