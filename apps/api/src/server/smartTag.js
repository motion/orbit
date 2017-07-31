// @flow
import { flatten } from 'lodash'
// import natural from 'natural'

// const classifier = new natural.BayesClassifier()

export default (phrases, phrase) => {
  let count = 0

  Object.keys(phrases).forEach(tag => {
    phrases[tag].forEach(phrase => {
      classifier.addDocument(phrase, tag)
    })
    count++
  })

  if (count === 0) return null

  classifier.train()

  return classifier.getClassifications(phrase)
}
