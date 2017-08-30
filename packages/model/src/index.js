// @flow
import Model$ from './model'
import query$ from './query'

export const Model = Model$
export const query = query$

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
