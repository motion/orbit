// @flow

export type PaneProps = {
  search: string,
  activeIndex: number,
  highlightIndex: number,
  paneProps: Object,
  onSelect: Function,
  getRef: Function,
  navigate: Function,
  data: Object,
}

export type PaneResult = {
  id?: string | number,
  title: string,
  type: string,
  icon?: string,
  data?: Object,
  category?: string,
  url?: Function,
  onSelect?: Function,
  static?: boolean,
}
