import path from 'path'
import { spawn } from 'child_process'

const script = path.resolve(__dirname, '../../python/run_embedding.py')

const job = spawn(`python3`, [script], {
  detached: false,
  stdio: [process.stdin, process.stdout, process.stderr],
})

export default async sentence => {
  const vectors = await (await fetch(
    `http://localhost:5000/get_sentence?sentence=${encodeURIComponent(
      sentence,
    )}`,
  )).json()
  return vectors
}
