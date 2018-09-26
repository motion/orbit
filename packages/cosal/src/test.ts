import { getCovariance } from './getCovariance'
import { toCosal } from './toCosal'
import { getTopWords, Cosal } from './cosal'
import testDocs from './test.data'

const data = [
  'ok First one is I started a roadmap ticket to organize post-launch stuff Starting announcements so we can put big things here for people to see, especially for stuff where we all need to run commands or look at something. We should avoid talking about anything here (maybe I\'ll lock it in some way if possible)',
  'The solution is to understand words as hidden inferences – they refer to a multidimensional correlation rather than to a single cohesive property.',
  'But the tails still come apart. If we ask whether Mike Tyson is stronger than some other very impressive strong person, the answer might very well be “He has better arm strength, but worse grip strength”.',
]

async function main() {
  const cosal = new Cosal({ database: '1' })

  // scan some documents into cosal
  await cosal.scan(testDocs.map((text, id) => ({ text, id })))

  // now do a search
  const results = await cosal.search('big southern state')

  console.log(
    'results',
    results.map(result => result.pairs.map(x => x.string).join(' ')).slice(0, 5),
  )
}

export async function testTopWords() {
  const covar = getCovariance([])

  for (const text of data) {
    const cosal = await toCosal(text, covar)
    const topWords = await getTopWords(text, 5)
    console.log('topWords', topWords)
    console.log(
      'allWords',
      cosal.pairs.map(({ string, weight }) => `${string}-${`${weight}`.slice(2, 3)}`).join(' '),
    )
  }
}

main()
