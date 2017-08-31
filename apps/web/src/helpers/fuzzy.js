import fuzzySearch from 'fuzzysearch'

export default function fuzzy(
  haystack,
  needle,
  { max = Infinity, property = 'title' } = {}
) {
  const total = haystack.length
  const results = []

  for (let i = 0; i < total; i++) {
    if (
      fuzzySearch(needle.toLowerCase(), haystack[i][property].toLowerCase())
    ) {
      results.push(haystack[i])
      if (results.length === max) {
        break
      }
    }
  }

  return results
}
