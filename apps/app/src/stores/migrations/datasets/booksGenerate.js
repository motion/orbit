// requires CMU Book Summary Corpus

const fs = require('fs')

const x = fs.readFileSync('./booksummaries.txt').toString()
const res = []

x
  .split('\n')
  .slice(0, 100)
  .map(i => {
    const [id, weird, name, author, date, meta, summary] = i.split('\t')
    res.push({
      title: `${name} by ${author}`,
      text: summary.slice(0, 2000),
    })
  })

fs.writeFileSync('./books.json', JSON.stringify(res, 0, 2))
