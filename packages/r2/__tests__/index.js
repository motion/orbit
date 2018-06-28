/* eslint-env jest */

import assert from 'assert'

import { get } from '..'

test('r2.get()', async () => {
  const result = await get('https://jsonplaceholder.typicode.com/posts/1')
  const json = await result.json
  assert(json)
  assert.equal(json.id, 1)
})
