import { AppDefinition } from '@o/models'

import { reporter } from '../reporter'
import { getWorkspaceAppPaths } from './getWorkspaceAppPaths'
import { requireAppDefinition } from './requireAppDefinition'

export async function requireWorkspaceDefinitions(
  directory: string,
  entry: 'node' | 'web',
): Promise<AppDefinition[]> {
  const appsMeta = await getWorkspaceAppPaths(directory)

  return (await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      const res = await requireAppDefinition({ packageId, directory, types: [entry] })
      if (res.type === 'error') {
        reporter.info(`No node api, error: ${res.message}`)
        return null
      }
      return res.definition
    }),
  )).filter(Boolean)
}
