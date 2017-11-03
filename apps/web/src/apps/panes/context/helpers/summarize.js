import jaccard from './jaccard'

// var getSentencesFromArticle = require('get-sentences-from-article')
export const summarizeWithQuestion = (text, question, numberSentences = 3) => {
  var weigthedSentences = new Array()
  const sentences = text.split('.').slice(1)
  let lines = []
  if (sentences) {
    for (var i = 0; i < sentences.length; i++) {
      weigthedSentences.push({
        index: i,
        sentence: sentences[i],
        weight: jaccard.jaccardSimilarity(question, sentences[i]),
      })
    }
    var sortedArray = weigthedSentences
      .sort(function(a, b) {
        return b.weight - a.weight
      })
      .slice(0, numberSentences)
      .sort(function(a, b) {
        return a.index - b.index
      })

    var result = []
    for (var j = 0; j < sortedArray.length; j++) {
      result = [...result, sortedArray[j]['sentence'] + '.']
    }
    lines = result
  }
  return lines
}

export const summarize = (text, numberSentences = 3) => {
  var weigthedSentences = new Array()
  const sentences = text.split('.').slice(1)
  let lines = []
  if (sentences) {
    for (var i = 0; i < sentences.length; i++) {
      weigthedSentences.push({
        index: i,
        sentence: sentences[i],
        weight: jaccard.jaccardSimilarity(sentences[0], sentences[i]),
      })
    }
    var sortedArray = weigthedSentences
      .sort(function(a, b) {
        return b.weight - a.weight
      })
      .slice(0, numberSentences)
      .sort(function(a, b) {
        return a.index - b.index
      })

    var result = []
    for (var i = 0; i < sortedArray.length; i++) {
      result = [...result, sortedArray[i]['sentence'] + '.']
    }
    lines = result
  }

  return lines
}
