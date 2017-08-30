import fuzzy from 'fuzzysearch'

export function filterItem(
  haystack,
  needle,
  { max = Infinity, property = 'title' } = {}
) {
  const total = haystack.length
  const results = []

  for (let i = 0; i < total; i++) {
    if (fuzzy(needle.toLowerCase(), haystack[i][property].toLowerCase())) {
      results.push(haystack[i])
      if (results.length === max) {
        break
      }
    }
  }

  return results
}
