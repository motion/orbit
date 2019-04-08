export interface ReactiveStore<A extends Object> {
  props?: A
  dispose(): void
}

export class Store<Props extends any> implements ReactiveStore<Props> {
  props: Props

  constructor(props: Props) {
    this.props = props
  }

  dispose() {}
}
