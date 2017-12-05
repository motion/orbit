function vecDotProduct(vecA, vecB) {
  var product = 0
  for (var i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i]
  }
  return product
}

function vecMagnitude(vec) {
  var sum = 0
  for (var i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i]
  }
  return Math.sqrt(sum)
}

export default function cosineSimilarity(vecA, vecB) {
  return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB))
}
