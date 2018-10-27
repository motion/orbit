let { Cosal } = require('../packages/cosal/_/cosal')
let titles = require('fs')
  .readFileSync('../../titles.en')
  .toString()
  .split('\n')

async function start() {
  let cosal = new Cosal()
  await cosal.start()
  const validTopics = titles
    .map(title => {
      const valid = title
        .split(' ')
        .map(x => !!cosal.allVectors[x])
        .every(Boolean)
      return valid ? title : false
    })
    .filter(Boolean)
  const uniq = [...new Set(validTopics)]
  require('fs').writeFileSync('./titles.json', JSON.stringify(uniq))
}

start()
