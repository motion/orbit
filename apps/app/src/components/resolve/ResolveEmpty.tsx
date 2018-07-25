import { AppStatePeekItem } from '../../../../stores/App'

const EMPTY_ITEM = {
  id: '',
  title: '',
  body: '',
  subtitle: '',
  location: '',
  icon: '',
  type: '',
  subType: '',
}

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
