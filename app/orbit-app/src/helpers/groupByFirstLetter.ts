import { memoize } from 'lodash'

function getLetter(name: string) {
  let letter = '0-9'
  if (name) {
    letter = name[0].toLowerCase()
    if (+name[0] === +name[0]) {
      letter = '0-9'
    }
  }
  return letter
}

export const groupByLetter = memoize(
  (key: string = 'name') =>
    function groupByLetter<A>(item: A, index: number, items: A[]): { separator?: string } {
      if (items[index - 1]) {
        const lastLetter = getLetter(items[index - 1][key])
        const thisLetter = getLetter(item[key])
        if (thisLetter !== lastLetter) {
          return {
            separator: thisLetter,
          }
        }
      } else {
        // first index
        return {
          separator: getLetter(item[key]),
        }
      }
      return item
    },
)
