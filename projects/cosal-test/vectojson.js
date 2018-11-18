// translate

let fs = require('fs')

let file = 'fil9.vec'
let vecs = fs.readFileSync(`./app_data/${file}`, 'utf8')
let out = {}
for (const line of vecs.split('\n').slice(1)) {
  let [word, vector] = [line.slice(0, line.indexOf(' ')), line.slice(line.indexOf(' ') + 1)]
  try {
    out[word] = vector
      .trim()
      .split(' ')
      .map(x => +x)
  } catch (err) {
    console.log('err', vector, word, err)
  }
}

fs.writeFileSync(`./app_data/${file}.json`, JSON.stringify(out, 0, 2))

// covariance

let cov = require('compute-covariance')

let matrix = Object.keys(out).map(k => out[k])
let equalMat = matrix.slice(0, matrix[0].length)

console.log('covariance dim', matrix[0].length, equalMat.length)

var covariance = cov(...equalMat)

fs.writeFileSync(`./app_data/${file}Covariance.json`, JSON.stringify(covariance, 0, 2))
