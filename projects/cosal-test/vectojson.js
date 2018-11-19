// translate

let fs = require('fs')

let file = process.env.FILE || 'fil9.vec'
let vecs = fs.readFileSync(`./app_data/${file}`, 'utf8')
let out = {}
for (const line of vecs.split('\n').slice(1)) {
  let [word, vector] = [line.slice(0, line.indexOf(' ')), line.slice(line.indexOf(' ') + 1)]
  if (!/^[a-zA-Z0-9]+$/.test(word)) {
    continue
  }
  out[word.toLowerCase()] = vector
    .trim()
    .split(' ')
    .map(x => +x)
}

console.log('done parsing, write', Object.keys(out).length, 'words')

// const json = require('big-json')

// const stringifyStream = json.createStringifyStream({
//   body: out,
// })

// fs.writeFileSync(`./app_data/${file}.json`, '')

// stringifyStream.on('data', chunk => {
//   fs.appendFileSync(`./app_data/${file}.json`, chunk)
// })

let Stringify = require('json-stream-stringify')
let stream = new Stringify(out)
stream.pipe(fs.createWriteStream(`./app_data/${file}.json`))

// fs.writeFileSync(`./app_data/${file}.json`, JSON.stringify(out, 0, 2))

// covariance

// let cov = require('compute-covariance')

// let matrix = out.map(x => x[1])
// let equalMat = matrix.slice(0, matrix[0].length)

// console.log('covariance dim', matrix[0].length, equalMat.length)

// var covariance = cov(...equalMat)

// fs.writeFileSync(`./app_data/${file}Covariance.json`, JSON.stringify(covariance, 0, 2))
