import { AppModel, loadOne, save } from '@o/kit'

import { om } from '../om/om'

export async function insertDevelopmentPostgres() {
  const activeSpace = om.state.spaces.activeSpace
  const app = await loadOne(AppModel, {
    args: {
      where: {
        identifier: 'postgres',
        name: 'Postgres on docker',
        spaceId: activeSpace.id,
      },
    },
  })
  if (app) return
  save(AppModel, {
    colors: [],
    createdAt: new Date(),
    identifier: 'postgres',
    name: 'Postgres on docker',
    tabDisplay: 'plain',
    target: 'app',
    token: '',
    spaceId: activeSpace.id,
    data: {
      credentials: {
        hostname: 'localhost',
        database: 'test',
        username: 'postgres',
        password: 'test',
      },
    } as any,
  })
}
