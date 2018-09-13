import { getCovariance } from './getCovariance'
import { toCosal, Weight } from './toCosal'

export { getCovariance } from './getCovariance'
export { toCosal } from './toCosal'

let emptyCovar = getCovariance([])

export async function getWordWeights(text: string): Promise<Weight[]> {
  emptyCovar = emptyCovar || getCovariance([])
  const cosal = await toCosal(text, emptyCovar)
  return cosal.pairs
}
