// @flow
import Model$ from './model'
export const Model = Model$

import IndexDB$ from './indexDB'
export const IndexDB = IndexDB$

// mobx helpers
import * as Mobx from 'mobx'
export const { computed, observable, autorun, react, isObservable } = Mobx

// schema helpers
import validator$ from 'is-my-json-valid'
export const validator = validator$

import * as Properties from './properties'
export const {
  bool,
  array,
  object,
  str,
  string,
  nil,
  oneOf,
  compile,
  number,
  int,
} = Properties

export const schema = obj => validator(compile(obj))

import { CompositeDisposable as CD } from 'sb-event-kit'
export const CompositeDisposable = CD
