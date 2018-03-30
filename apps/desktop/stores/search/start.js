import execa from 'execa'
import { flatten } from 'lodash'
import path from 'path'
import { readFileSync } from 'fs'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const PYTHON_API = 'http://localhost:5000'
const startPython = async () => {
  const cwd = path.resolve(__dirname, '..', '..', '..', './python')
  execa(`python3`, [`run_embedding.py`], { cwd })
  let tries = 0
  while (true) {
    await sleep(450)
    try {
      const res = await fetch(PYTHON_API)
      if (res.status === 200) {
        return true
      }
    } catch (err) {}
    tries += 1
    if (tries > 100) {
      throw new Error(`Error connecting to python...`)
    }
  }
}

const readData = file => {
  const filePath = path.resolve(__dirname, `../../../data/${file}`)
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

export default async () => {
  await startPython()
  const dataset = flatten(
    ['datasets/books.json', 'datasets/pg.json'].map(readData),
  )

  return dataset
}
