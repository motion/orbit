import { Cosal } from './cosal'
import testDocs from './test.data'

const testSentences = [
  'ok First one is I started a roadmap ticket to organize post-launch stuff Starting announcements so we can put big things here for people to see, especially for stuff where we all need to run commands or look at something. We should avoid talking about anything here (maybe I\'ll lock it in some way if possible)',
  'The solution is to understand words as hidden inferences – they refer to a multidimensional correlation rather than to a single cohesive property.',
  'But the tails still come apart. If we ask whether Mike Tyson is stronger than some other very impressive strong person, the answer might very well be “He has better arm strength, but worse grip strength”.',
]

const addDocs = [
  'Heading to the great state of Mississippi at the invitation of their popular and respected Governor, @PhilBryantMS. Look forward to seeing the new Civil Rights Museum!',
]

let db = [...testDocs]

async function logSearch(cosal, str) {
  const results = await cosal.search(str)
  console.log(str, results.map(result => db[result.id]).slice(0, 5)
}

async function main() {
  const cosal = new Cosal()

  // scan some documents into cosal
  await cosal.scan(testDocs.map((text, id) => ({ text, id: `${id}` })))

  await logSearch(cosal, 'big southern state')

  // scan a few more docs
  db = [...db, ...addDocs]
  await cosal.scan(addDocs.map((text, id) => ({ text, id: `${id + testDocs.length}` })))

  console.log('\n now search with more relevant docs')
  await logSearch(cosal, 'big southern state')

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
