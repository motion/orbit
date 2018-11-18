import { memoize, random } from 'lodash'

export const defaultSlang = {
  dont: 'don\'t',
  yea: 'yes',
  ya: 'yes',
  nope: 'no',
  wont: 'won\'t',
  wouldnt: 'wouldn\'t',
  hes: 'he\'s',
  shes: 'she\'s',
}

export const getWordVector = memoize(
  (word: string, vectors, fallbackVector): number[] => {
    word = word
      .replace('.', '')
      .replace(';', '')
      .replace(',', '')
      .toLowerCase()
    const randomVector = fallbackVector.map(() => random(-0.15, 0.15))
    const vector = word === 'constructor' ? randomVector : vectors[word] || randomVector
    return vector
  },
)

export function toWords(s: string): string[] {
  return s
    .replace(/&amp;/g, '')
    .replace(/’/g, '\'')
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(/<.*>/g, '')
    .replace(/[^'.,;őa-z0-9]/gi, ' ')
    .replace(/.,;$/g, ' ')
    .split(' ')
    .filter(w => w.trim().length > 0)
}

export function sigmoid(x) {
  const horizontal = 8.6
  const vertical = 0.784
  return (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5
}
