// @flow

import view_ from './view'
import store_ from './store'
import * as Helpers from './helpers'

export const view = view_
export const store = store_

for (const name of Object.keys(Helpers)) {
  exports[name] = Helpers[name]
}

// ViewType
import type { ViewClass } from './view'
export type ViewType = ViewClass

// StoreType
import type { StoreClass } from './store'
export type StoreType = StoreClass

// constants
import * as Constants_ from './constants'
export const Constants = Constants_

import * as React from 'react'
export const { Component } = React

// import type { CompositeDisposable } from '@mcro/decor'
// declare class Component extends Component<DP, Props, State> {
//   watch: Helper.watch,
//   react: Helpers.react,
//   emitter: Emitter,
//   emit(name: string, data: any): void,
//   props: $Abstract<Props>,
//   render(props: Props, state: State, context: Context): React$Element<any>,
//   subscriptions: CompositeDisposable,
// }
