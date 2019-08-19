import { AppDefinition, StatusReply } from '@o/models'

import { getWorkspaceApps } from './getWorkspaceApps'
import { requireAppDefinition } from './requireAppDefinition'

export async function requireWorkspaceDefinitions(
  directory: string,
  entry: 'node' | 'web',
): Promise<StatusReply<AppDefinition>[]> {
  const appsMeta = await getWorkspaceApps(directory)
  return (await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      const res = await requireAppDefinition({ packageId, directory, types: [entry] })
      if (res.type !== 'success') {
        return {
          type: 'error',
          message: `No node api for ${packageId}, error: ${res.message}`,
        } as const
      }
      return {
        type: 'success',
        message: 'Success',
        value: res.value,
      } as const
    }),
  )).filter(Boolean)
}
