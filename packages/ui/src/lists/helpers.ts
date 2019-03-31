import sum from 'hash-sum'
import { Config } from '../helpers/configure'

export function getItemsKey(items: any[]) {
  return sum(items.map(Config.getItemKey))
}
