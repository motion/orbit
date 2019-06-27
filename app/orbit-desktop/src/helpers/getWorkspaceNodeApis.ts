import { getWorkspaceAppPaths, requireAppDefinition } from '@o/cli'
import { Logger } from '@o/logger'
import { AppDefinition, Space } from '@o/models'

const log = new Logger('getWorkspaceNodeApis')

export async function getWorkspaceNodeApis(space: Space): Promise<AppDefinition[]> {
  const appsMeta = await getWorkspaceAppPaths(space.directory)
  return (await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      const res = await requireAppDefinition({ packageId, directory, types: ['node'] })
      if (res.type === 'error') {
        log.info(`No node api, error: ${res.message}`)
        return null
      }
      return res.definition
    }),
  )).filter(Boolean)
}
