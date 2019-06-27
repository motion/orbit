import { AppDefinition } from '@o/models'

import { reporter } from '../reporter'
import { getWorkspaceAppPaths } from './getWorkspaceAppPaths'
import { requireAppDefinition } from './requireAppDefinition'

export async function requireWorkspaceDefinitions(
  directory: string,
  entry: 'node' | 'web',
): Promise<({ type: 'success'; value: AppDefinition } | { type: 'error'; value: string })[]> {
  const appsMeta = await getWorkspaceAppPaths(directory)
  return (await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      const res = await requireAppDefinition({ packageId, directory, types: [entry] })
      if (res.type === 'error') {
        const message = `No node api, error: ${res.message}`
        reporter.error(message)
        return {
          type: 'error' as const,
          value: message,
        }
      }
      return {
        type: 'success' as const,
        value: res.definition,
      }
    }),
  )).filter(Boolean)
}
