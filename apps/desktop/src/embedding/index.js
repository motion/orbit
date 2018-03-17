import path from 'path'
import execa from 'execa'

const script = path.resolve(__dirname, '../../python/run_embedding.py')

execa.shell(`python3`, [script])

export default async sentence => {
  const vectors = await (await fetch(
    `http://localhost:5000/get_sentence?sentence=${encodeURIComponent(
      sentence,
    )}`,
  )).json()
  return vectors
}
