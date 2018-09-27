import { Cosal } from './cosal'
import testDocs from './test.data'

const testSentences = [
  'ok First one is I started a roadmap ticket to organize post-launch stuff Starting announcements so we can put big things here for people to see, especially for stuff where we all need to run commands or look at something. We should avoid talking about anything here (maybe I\'ll lock it in some way if possible)',
  'The solution is to understand words as hidden inferences – they refer to a multidimensional correlation rather than to a single cohesive property.',
  'But the tails still come apart. If we ask whether Mike Tyson is stronger than some other very impressive strong person, the answer might very well be “He has better arm strength, but worse grip strength”.',
]

let db = []

async function logSearch(cosal, str) {
  console.time('search')
  const results = await cosal.search(str, 10)
  console.timeEnd('search')
  console.log(str, JSON.stringify(results.map(result => db[result.id].text).slice(0, 5), null, 2))
}

function insert(amt = 99) {
  const next = testDocs
    .slice(db.length, db.length + amt)
    .map((text, idx) => ({ text, id: idx + db.length }))
  db = [...db, ...next]
  return next
}

const cosal = new Cosal()

async function main() {
  incrementalScanTest()
}

export async function incrementalScanTest() {
  // lets do 10 inserts and search each time
  for (let i = 0; i < 10; i++) {
    const next = insert()
    console.log('insert', next.length)
    await cosal.scan(next)
    await logSearch(cosal, 'big southern state')
  }
}

export async function topWordsTest() {
  console.log('\n sentence test')
  for (const text of testSentences) {
    console.log(
      'weighted words',
      (await cosal.getWordWeights(text))
        .map(({ string, weight }) => `${string}-${`${weight}`.slice(2, 3)}`)
        .join(' '),
    )
    console.log('top words', await cosal.getTopWords(text, 5))
  }
}

main()
