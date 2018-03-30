import path from 'path'
import execa from 'execa'

const script = path.resolve(__dirname, '../../python/run_embedding.py')
let server
const serverUrl = `http://localhost:5000`
export default async words => {
  if (!server) {
    console.log('running things')
    server = execa.shell(`python3`, [script])
  }
  const vectors = await (await fetch(
    `${serverUrl}/get_sentence?words=${encodeURIComponent(
      JSON.stringify(words),
    )}`,
  )).json()

  return vectors.map(vector => vector.map(i => +i.toFixed(4)))
}
