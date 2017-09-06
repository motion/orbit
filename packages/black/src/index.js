// @flow

import view_ from './view'
import store_ from './store'
import * as Helpers from './helpers'

export const view = view_
export const store = store_

for (const name of Object.keys(Helpers)) {
  exports[name] = Helpers[name]
}

// constants
import * as Constants_ from './constants'
export const Constants = Constants_

import * as React from 'react'
export const { Component } = React

export interface View extends React.Component<DP, Props, State> {
  watch: Helper.watch,
  react: Helpers.react,
  emitter: Emitter,
  emit(name: string, data: any): void,
  props: $Abstract<Props>,
  render(props: Props, state: State, context: Context): React$Element<any>,
  subscriptions: CompositeDisposable,
}
