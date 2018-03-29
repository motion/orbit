import { comparer } from 'mobx'

export {
  fromStream,
  toStream,
  whenAsync,
  now,
  fromPromise,
  fromResource,
} from 'mobx-utils'

export { when } from 'mobx'

export const isEqual = comparer.structural
