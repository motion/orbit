import { countBy, reverse, sumCounts, sortBy } from 'lodash'
import entityStopwords from './entityStopwords'

export default items => {
  const entityByItems = {}
  const totalCounts = {}
  const countsByText = content => {
    const list = (
      content
        .replace(/[\-\(\)\"\']/g, ' ')
        .replace(/\'/g, '')
        .match(
          // !! Adds 2 characters to start of matches for some reason
          /([^.\s!?])\s*\b([A-Z][a-z'-]+(?:\s*\b[A-Z][a-z']+\b)*)\b/gm
        ) || []
    )
      .map(item => item.substr(2))
      .filter(item => !/\n/.test(item))
      .filter(item => entityStopwords.indexOf(item.toLowerCase()) == -1)

    list.forEach(word => {
      if (!totalCounts[word]) totalCounts[word] = 0
      totalCounts[word] += 1
    })

    Array.from(new Set(list)).forEach(word => {
      if (!entityByItems[word]) entityByItems[word] = 0
      entityByItems[word] += 1
    })

    return countBy(list)
  }

  // remove title in body
  items
    // .slice(0, 0)
    .map(_ =>
      _.body
        .split('\n')
        .filter(line => line.indexOf(':') !== 0)
        // remove first word
        .map(line => line.trim())
        .map(line => line.substr(line.indexOf(' ') + 1))
        // we should take out links, but of now..
        .join('\n')
    )
    .map(countsByText)

  // Grab anything that looks like a proper noun
  // Remove first two characters of every match
  // Remove any items that contain a new line
  // Remove any items that are contained in stopwords array
  // Convert to Set (removes duplicates) and back to Array
  // Sort alphabetically
  return reverse(
    sortBy(
      Object.keys(entityByItems)
        // .filter(word => entityByItems[word] > 3)
        .map(word => ({ word: word.trim(), totalCount: totalCounts[word] })),
      'totalCount'
    )
  ).map(({ word }) => word)
}
