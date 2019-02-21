import sum from 'hash-sum'
import { configure } from '../helpers/configure'

export function getItemsKey(items: any[]) {
  return sum(items.map(configure.getItemKey))
}
