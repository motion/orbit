import { random } from 'lodash'

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

export const getWordVector = (word: string, vectors, fallbackVector): number[] => {
  return vectors[word.toLowerCase()] || fallbackVector.map(() => random(-0.15, 0.15))
}

export const normalizeWord = word => word.replace(/[^a-zA-Z0-9- ]+/gi, '').toLowerCase()

export function toWords(s: string): { word: string; normalized: string }[] {
  const final = []
  for (const word of s.split(' ')) {
    const normalized = normalizeWord(word)
    if (normalized.length) {
      final.push({ word, normalized })
    }
  }
  return final
}

export function sigmoid(x) {
  const horizontal = 8.6
  const vertical = 0.784
  return (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5
}
