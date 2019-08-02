import { join } from 'path'

import { readWorkspaceAppDefs } from './readWorkspaceAppDefs'

describe('readWorkspaceAppDefs', () => {
  it('should find example workspace defs', async () => {
    const definitions = await readWorkspaceAppDefs({
      directory: join(__dirname, '..', '..', '..', '..', 'example-workspace'),
    })

    console.log('definitions', definitions)

    expect(definitions).toEqual([])
  })
})
