// this worker file lets us run it inside and outside a worker easily
// see ./nlpQuery for function/lic

import * as NLP from './nlpQuery'

export function setUserNames(a) {
  return NLP.setUserNames(a)
}

export function parseSearchQuery(a) {
  return NLP.parseSearchQuery(a)
}
