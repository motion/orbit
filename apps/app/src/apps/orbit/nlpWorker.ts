import compromise from 'compromise'
import Sherlockjs from 'sherlockjs'

const DATE_CLASS = 'date'
const NOUN_CLASS = 'noun'

const filterNounsObj = {
  week: true,
  month: true,
}

const filterNouns = strings => strings.filter(x => !filterNounsObj[x])

export function parseSearchQuery(query: string) {
  const nlp = compromise(query)
  const date = Sherlockjs.parse(query)
  const dateWords = nlp
    .dates()
    .out('frequency')
    .map(word => word.normal)
  const nounWords = filterNouns(nlp.nouns().out('frequency')).map(
    word => word.normal,
  )
  const words = query.split(' ')

  let highlights = {}

  for (const [index, word] of words.entries()) {
    if (date.startDate && dateWords.length) {
      if (dateWords.indexOf(word) > -1) {
        highlights[index] = DATE_CLASS
        continue
      }
    }
    if (nounWords.length) {
      if (nounWords.indexOf(word) > -1) {
        highlights[index] = NOUN_CLASS
      }
    }
  }

  return {
    date,
    highlights,
  }
}
