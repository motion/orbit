export function groupByFirstLetter<A extends any>(items: A[]): (A & { separator?: string })[] {
  const total = items.length

  if (total < 10) {
    return items
  }

  let resultsSectioned = []
  let lastLetter = ''

  for (const person of items) {
    let letter = person.name[0].toLowerCase()
    // is number
    if (+person.name[0] === +person.name[0]) {
      letter = '0-9'
    }
    const isNewSection = letter !== lastLetter
    lastLetter = letter
    if (isNewSection) {
      resultsSectioned.push({ ...person, separator: letter.toUpperCase() })
    } else {
      resultsSectioned.push(person)
    }
  }

  return resultsSectioned
}
