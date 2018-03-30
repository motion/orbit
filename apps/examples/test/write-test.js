const { readdirSync, readFileSync, writeFileSync } = require('fs')
const yaml = require('js-yaml')
const { sum } = require('lodash')

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

const parseYaml = text => {
  const lines = text.split('\n')
  const isIndented = text => text.indexOf('  ') === 0
  const obj = {}
  let currObj = ''
  lines.filter(line => line.length > 0).forEach(line => {
    if (isIndented(line)) {
      obj[currObj].push(line.trim().slice(2))
    } else {
      const slices = line
        .trim()
        .split(':')
        .filter(i => i.trim().length > 0)
      currObj = slices[0]
      obj[currObj] = []
      if (slices.length > 0) {
        obj[currObj].push(slices.slice(1).join(':'))
      }
    }
  })
  return obj
}

const read = () => {
  const dataDir = `./data`
  const out = []
  let queryCount = 0
  const files = readdirSync(dataDir).map(path => {
    const dir = `${dataDir}/${path}`
    if (path === 'posts') return
    readdirSync(dir).map(file => {
      const textPath = `${dataDir}/${path}/${file}`
      const text = readFileSync(textPath, 'utf8')
      const yamlObj = parseYaml(text)
      out.push(yamlObj)
    })
  })

  return out
}

const data = read()
const outFile = 'test.js'
writeFileSync(outFile, `export default ${JSON.stringify(data)}`)

const queries = sum(data.map(item => item.queries.length))

console.log(
  `writing ${data.length} documents and ${queries} queries to ${outFile}`,
)
