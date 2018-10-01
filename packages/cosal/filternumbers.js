const j = JSON.parse(require('fs').readFileSync('./vecs.json'))
const r = {}

for (const key in j) {
  if (+key == key) {
    continue
  }
  r[key] = j[key]
}

require('fs').writeFileSync('./vecs2.json', JSON.stringify(r), 'utf8')
