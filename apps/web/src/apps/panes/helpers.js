import fuzzy from 'fuzzysearch'

export function filterItem(
  haystack,
  needle,
  { max = Infinity, property = 'title' } = {}
) {
  const total = titles.length
  const titles = haystack.map(i => i[property])
  const found = fuzzy(titles, haystack)
  const foundSubset = found.slice(0, max)
  const results = []

  let lastFound = 0
  let finishedSearch = false

  while (results.length < max && !finishedSearch) {
    for (let i = lastFound; i < total; i++) {
      if (foundSubset[i] === haystack[i][property]) {
        results.push(haystack[i])
        lastFound = i
        break
      }
      if (i === total - 1) {
        finishedSearch = true
      }
    }
  }

  return results
}

window.f = filterItem
