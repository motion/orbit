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
    icon: '',
    name: 'Postgres on docker',
    tabDisplay: 'plain',
    target: 'app',
    token: '',
    spaceId: activeSpace.id,
    data: {
      setup: {
        hostname: '127.0.0.1',
        database: 'test',
        username: 'postgres',
        password: 'test',
        port: 5942,
      },
    } as any,
  })
}
