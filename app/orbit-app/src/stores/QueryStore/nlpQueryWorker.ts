// this worker file lets us run it inside and outside a worker easily
import * as NLP from './nlpQuery'

export function setUserNames(a) {
  return NLP.setUserNames(a)
}

export function parseSearchQuery(a) {
  return NLP.parseSearchQuery(a)
}

// this is mostly to mimic the types that webpack-loader gives you...
export default function initNlp() {
  return {
    parseSearchQuery,
    setUserNames,
  }
}
