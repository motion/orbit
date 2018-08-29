import { AppConfig } from '@mcro/stores'
import { EMPTY_ITEM } from '../../constants'

export const ResolveEmpty = ({
  item = EMPTY_ITEM,
  children,
}: {
  item: AppConfig
  children: Function
}) =>
  children({
    ...EMPTY_ITEM,
    ...item,
  })
