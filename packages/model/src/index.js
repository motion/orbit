// @flow
export Model from './model'
export query from './query'

// mobx helpers
export { computed, observable, autorun, react, isObservable } from 'mobx'

// schema helpers
export validator from 'is-my-json-valid'
export {
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
} from './properties'
import { compile } from './properties'
import validator from 'is-my-json-valid'
export const schema = obj => validator(compile(obj))
