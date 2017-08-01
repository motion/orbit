import fuzzy from 'fuzzy'

export function filterItem(haystack, needle) {
  return fuzzy
    .filter(needle, haystack, {
      extract: el => el.title,
      pre: '<',
      post: '>',
    })
    .map(item => item.original)
    .filter(x => !!x)
}
