// @flow

export type PaneProps = {|
  search: string,
  activeIndex: number,
  paneProps: Object,
  onSelect: Function,
  getRef: Function,
  navigate: Function,
|}

export type PaneResult = {|
  title: string,
  type: string,
  icon: string,
  data?: Object,
  category?: string,
  url?: Function,
  onSelect?: Function,
|}
