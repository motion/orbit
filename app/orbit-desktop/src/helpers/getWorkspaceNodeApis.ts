import { getWorkspaceApps, requireAppDefinition } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppDefinition, Space } from '@o/models'

const log = new Logger('getWorkspaceNodeApis')

export async function getWorkspaceNodeApis(space: Space): Promise<AppDefinition[]> {
  const appsMeta = await getWorkspaceApps(space.directory)
  return (await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      const res = await requireAppDefinition({ packageId, directory, types: ['node'] })
      if (res.type === 'error') {
        log.verbose(`No node api, error: ${res.message}`)
        return null
      }
      return res.value
    }),
  )).filter(Boolean)
}
