import convert from 'convert-units'

const convertSplit = /([0-9]+)(.*) to (.*)/
const splitter = str => {
  const res = str.match(convertSplit)
  if (res.length === 4) {
    return res.slice(1)
  }
  return null
}

export const fn = ({ term, display }) => {
  if (term && term.indexOf(' to ')) {
    try {
      const [unit, before, after] = splitter(term)
      const result = convert(unit)
        .from(before)
        .to(after)
      if (result) {
        display({
          id: -1,
          title: `${result}${after}`,
        })
        return
      }
    } catch (err) {}
  }
  display([])
}
