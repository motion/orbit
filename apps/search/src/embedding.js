import { minKBy, cosineSimilarity } from './helpers'
import { store, watch } from '@mcro/black/store'

let vectorCache = null

@store
export default class Embedding {
  vectors = null
  dimensionality = null

  @watch loading = () => this.vectors === null

  async willMount() {
    this.vectors = await this.loadData()
    this.dimensionality = this.vectors['test'].length
  }

  loadData = async () => {
    if (vectorCache) {
      return vectorCache
    }
    const url = `/vectors50k.txt`
    const text = await (await fetch(url)).text()
    const vectors = {}
    text.split('\n').forEach(line => {
      const split = line.split(' ')
      const word = split[0]
      const vsList = new Uint16Array(
        split.slice(1).map(i => Math.floor(+i * 100))
      )
      vectors[word] = vsList
    })

    vectorCache = vectors

    return vectors
  }

  nearestWords = word => {
    return this.nearestWordsByVec(this.vectors[word])
  }

  nearestWordsByVec = vec => {
    const vecs = Object.keys(this.vectors).map(word => ({
      word,
      vec: this.vectors[word],
      distance: cosineSimilarity(Math.random(), vec, this.vectors[word]),
    }))
    return minKBy(vecs, 7, _ => -_.distance)
  }

  wordDistance = (word, word2) => {
    const vec = this.vectors[word]
    return cosineSimilarity(Math.random(), vec, this.vectors[word2])
  }
}
