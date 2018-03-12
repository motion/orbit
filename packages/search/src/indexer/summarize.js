import { find, intersection, range } from 'lodash'
import { splitSentences } from '../helpers'

const textRank = (V, niter, dampening) => {
  const d = dampening || 0.85
  const K = niter || 200
  const denom = []
  const ws = []

  const sum = edges => {
    let acc = 0.0

    edges.forEach(edge => {
      acc += edge.weight
    })

    return acc
  }

  const accum = i => {
    var sum = 0.0
    V[i].in.forEach(v_j => {
      var j = v_j.index
      var v_ji = find(V[j].out, x => x.index == i)
      sum += v_ji ? v_ji.weight / denom[j] * ws[j].score : 0
    })
    return sum
  }

  V.forEach((v_j, j) => {
    denom[j] = sum(v_j.out)
    ws[j] = { name: v_j.name, vertex: j, score: Math.random() }
  })

  range(K).forEach(k => {
    range(V.length).forEach(i => {
      let acc = accum(i)
      ws[i].score = 1 - d + d * acc
    })
  })

  ws.sort((x, y) => y.score - x.score)

  return ws
}

const sentExGraph = sentences => {
  const sim = (s1, s2) => {
    return (
      intersection(s1, s2).length / (Math.log(s1.length) + Math.log(s2.length))
    )
  }

  let V = []
  range(sentences.length).forEach(i => {
    range(sentences.length).map(j => {
      const score = sim(sentences[i], sentences[j])
      V[i] = V[i] || { name: sentences[i], out: [], in: [] }
      V[j] = V[j] || { name: sentences[j], out: [], in: [] }
      // Symmetric
      V[i].out.push({ index: j, weight: score })
      V[i].in.push({ index: j, weight: score })
      V[j].in.push({ index: i, weight: score })
      V[j].out.push({ index: i, weight: score })
    })
  })
  return V
}

export default (text, count) => {
  // First convert to a sentence graph as described in the paper
  const sentences = splitSentences(text).map(s => s.split(' '))
  const graph = sentExGraph(sentences)
  // Now run 40 iterations of the algorithm
  let ws = textRank(graph, 40)
  // Get the top N sentence
  ws = ws.slice(0, count)
  // Reorder the top N sentences by article order
  ws.sort((a, b) => a.vertex - b.vertex)
  return ws.map(({ name }) => name.join(' ')).join('\n')
}
