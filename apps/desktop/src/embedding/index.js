import path from 'path'
import execa from 'execa'

const serverUrl = `http://localhost:5000`
export default async words => {
  const vectors = await (await fetch(
    `${serverUrl}/get_sentence?words=${encodeURIComponent(
      JSON.stringify(words),
    )}`,
  )).json()

  return vectors.map(vector => vector.map(i => +i.toFixed(4)))
}
