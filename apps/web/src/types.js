// @flow
import typeof PaneStore from '~/views/pane/paneStore'

export type PaneProps = {
  search: string,
  paneStore: PaneStore,
  getRef: Function,
  navigate: Function,
  data: Object,
}

export type PaneResult = {
  id?: string | number,
  title: string,
  type?: string,
  icon?: string,
  data?: Object,
  category?: string,
  url?: Function,
  onSelect?: Function,
  static?: boolean,
}
