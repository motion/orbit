import { comparer } from 'mobx'

export {
  fromStream,
  toStream,
  now,
  fromPromise,
  fromResource,
} from 'mobx-utils'

export { when } from 'mobx'

export const isEqual = comparer.structural
