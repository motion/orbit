// @flow

export type PaneProps = {
  search: string,
  activeIndex: number,
  paneProps: Object,
  onSelect: Function,
  getRef: Function,
  navigate: Function,
  data: Object,
}

export type PaneResult = {
  title: string,
  type: string,
  icon?: string,
  data?: Object,
  category?: string,
  url?: Function,
  onSelect?: Function,
  static?: boolean,
}

declare var module: {
  hot: {
    accept(path: string | (() => void), callback?: () => void): void,
  },
}

declare var log: (...args: any) => void
