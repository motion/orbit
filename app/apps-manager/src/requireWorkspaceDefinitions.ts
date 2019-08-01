import { AppDefinition } from '@o/models'

import { getWorkspaceApps } from './getWorkspaceApps'
import { requireAppDefinition } from './requireAppDefinition'

export async function requireWorkspaceDefinitions(
  directory: string,
  entry: 'node' | 'web',
): Promise<({ type: 'success'; value: AppDefinition } | { type: 'error'; value: string })[]> {
  const appsMeta = await getWorkspaceApps(directory)
  return (await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      const res = await requireAppDefinition({ packageId, directory, types: [entry] })
      if (res.type === 'error') {
        return {
          type: 'error',
          value: `No node api, error: ${res.message}`,
        } as const
      }
      return {
        type: 'success',
        value: res.value,
      } as const
    }),
  )).filter(Boolean)
}
