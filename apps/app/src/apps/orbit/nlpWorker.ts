import compromise from 'compromise'
import Sherlockjs from 'sherlockjs'

const filterNounsObj = {
  week: true,
  month: true,
}

const filterNouns = strings => strings.filter(x => !filterNounsObj[x])

export function parseSearchQuery(query: string) {
  const nlp = compromise(query)
  return {
    dates: Sherlockjs.parse(query),
    nouns: filterNouns(nlp.nouns().out('frequency')),
  }
}
