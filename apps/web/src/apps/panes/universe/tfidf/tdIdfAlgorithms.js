// @flow

/**
 * Stop words list copied from Lunr JS.
 */
const stopWords = {
  a: true,
  able: true,
  about: true,
  across: true,
  after: true,
  all: true,
  almost: true,
  also: true,
  am: true,
  among: true,
  an: true,
  and: true,
  any: true,
  are: true,
  as: true,
  at: true,
  be: true,
  because: true,
  been: true,
  but: true,
  by: true,
  can: true,
  cannot: true,
  could: true,
  dear: true,
  did: true,
  do: true,
  does: true,
  either: true,
  else: true,
  ever: true,
  every: true,
  for: true,
  from: true,
  get: true,
  got: true,
  had: true,
  has: true,
  have: true,
  he: true,
  her: true,
  hers: true,
  him: true,
  his: true,
  how: true,
  however: true,
  i: true,
  if: true,
  in: true,
  into: true,
  is: true,
  it: true,
  its: true,
  just: true,
  least: true,
  let: true,
  like: true,
  likely: true,
  may: true,
  me: true,
  might: true,
  most: true,
  must: true,
  my: true,
  neither: true,
  no: true,
  nor: true,
  not: true,
  of: true,
  off: true,
  often: true,
  on: true,
  only: true,
  or: true,
  other: true,
  our: true,
  own: true,
  rather: true,
  said: true,
  say: true,
  says: true,
  she: true,
  should: true,
  since: true,
  so: true,
  some: true,
  than: true,
  that: true,
  the: true,
  their: true,
  them: true,
  then: true,
  there: true,
  these: true,
  they: true,
  this: true,
  tis: true,
  to: true,
  too: true,
  twas: true,
  us: true,
  wants: true,
  was: true,
  we: true,
  were: true,
  what: true,
  when: true,
  where: true,
  which: true,
  while: true,
  who: true,
  whom: true,
  why: true,
  will: true,
  with: true,
  would: true,
  yet: true,
  you: true,
  your: true,
}

//Returns an array of maps(one for each document)
//The maps contains word(key) and nr. appearances(value)
function computeWordsDocumentsFrequency(documents) {
  let documentMaps = documents.map(document => {
    let documentMap = new Map()
    document
      .split(' ')
      .filter(word => !stopWords[word] && word.length > 0)
      .forEach(rawWord => {
        let word = purgeWord(rawWord)
        let nrOfOccurances = documentMap.get(word)
        if (nrOfOccurances === undefined) {
          documentMap.set(word, 1)
        } else {
          documentMap.set(word, ++nrOfOccurances)
        }
      })
    return documentMap
  })
  return documentMaps
}

//Compute in how many of the documents each woerd accured
//Returns an occurance map with word(key) and nr. documents in which it appeared(value)
function computeWordOccuranceFrequency(documentsWordFrequencyMaps) {
  let occurancesMap = new Map()
  documentsWordFrequencyMaps.forEach(documentMap => {
    documentMap.forEach((nrOccurancesInDoc, word) => {
      let nrOfOccurances = occurancesMap.get(word)
      if (nrOfOccurances === undefined) {
        occurancesMap.set(word, 1)
      } else {
        occurancesMap.set(word, ++nrOfOccurances)
      }
    })
  })
  return occurancesMap
}

//Based on an occurance map, the nr of documents and an idf weight function,
// compute the weight for each word
//Returns a map with word(key) and weight(value)
function computeWordsWeightMap(
  occurancesMap,
  nrOfDocuments,
  inverseDocumentFrequencyFunction
) {
  let weightMap = new Map()
  occurancesMap.forEach((nrOfOccurances, word) => {
    weightMap.set(
      word,
      inverseDocumentFrequencyFunction(nrOfDocuments, nrOfOccurances)
    )
  })
  return weightMap
}

//Returns an array of importance maps (one for each documentMap)
//They contain word(key) and importance(value)
function computeDocumentWordImportanceMap(
  documentMaps,
  weightMap,
  textFrequencyWeightFunction
) {
  let importanceMaps = []
  documentMaps.forEach(documentMap => {
    let importanceMap = new Map()
    documentMap.forEach((nrOfOccurances, word) => {
      let importance =
        textFrequencyWeightFunction(nrOfOccurances) * weightMap.get(word)
      importanceMap.set(word, importance)
    })
    importanceMaps.push(importanceMap)
  })
  return importanceMaps
}

//Remove whitespaces, capitalization and other characters that might "slip into the word"
function purgeWord(str) {
  str = str.replace(' ', '')
  str = str.replace(',', '')
  str = str.toLowerCase()
  return str
}

module.exports = {
  computeWordsDocumentsFrequency: computeWordsDocumentsFrequency,
  computeWordOccuranceFrequency: computeWordOccuranceFrequency,
  computeWordsWeightMap: computeWordsWeightMap,
  computeDocumentWordImportanceMap: computeDocumentWordImportanceMap,
}
