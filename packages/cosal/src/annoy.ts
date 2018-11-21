import { exec } from 'child_process'
import Path from 'path'
import { Result } from './cosal'

const execAnnoy = env => {
  return new Promise<any>((res, rej) => {
    exec(
      `python ${Path.join(__dirname, '..', 'annoy.py')}`,
      {
        env,
      },
      (err, data) => {
        if (err) {
          return rej(`${err.message} ${err.stack}`)
        }
        return res(data ? JSON.parse(data) : null)
      },
    )
  })
}

export async function annoyScan({ db, path }) {
  await execAnnoy({
    SCAN: 'true',
    DB_FILE: path,
    DB_NAME: db,
    ANNOY_FILE: Path.join(path, '..', `${db}_annoy.ann`),
  })
}

export async function annoySearch({ path, db, vector, max }) {
  const out = await execAnnoy({
    SEARCH: 'true',
    DB_NAME: db,
    DB_FILE: path,
    ANNOY_FILE: Path.join(path, '..', `${db}_annoy.ann`),
    VECTOR: JSON.stringify(vector),
    COUNT: max,
  })
  if (!out) {
    throw new Error('No data returned from search')
  }
  // map to result
  const result: Result[] = []
  for (let i = 0; i < out[0].length; i++) {
    result.push({
      id: out[0][i],
      distance: out[1][i],
    })
  }
  return result
}

export async function annoyRelated({ path, db, index, max }) {
  return await execAnnoy({
    RELATED: 'true',
    DB_NAME: db,
    DB_FILE: path,
    ANNOY_FILE: Path.join(path, '..', `${db}_annoy.ann`),
    INDEX: index,
    COUNT: max,
  })
}
