import sum from 'hash-sum'
import { Config } from '../helpers/configureUI'

export function getItemsKey(items: any[]) {
  return sum(items.map(Config.getItemKey))
}
