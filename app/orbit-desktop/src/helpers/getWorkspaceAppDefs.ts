import { AppDefinition, Logger } from '@o/kit'
import { Space } from '@o/models'
import { join } from 'path'

import { getWorkspaceAppMeta } from './getWorkspaceAppMeta'

type AppDefinitions = { [id: string]: AppDefinition }

const log = new Logger('getWorkspaceAppDefs')

export async function getWorkspaceAppDefs(
  space: Space,
): Promise<{
  definitions: AppDefinitions | null
  packageIdToIdentifier: { [key: string]: string }
}> {
  const appsMeta = await getWorkspaceAppMeta(space)
  const definitions: AppDefinitions = {}
  const packageIdToIdentifier = {}

  await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      try {
        const nodeEntry = requireAppNodeEntry(directory)
        if (nodeEntry.type === 'error') {
          console.error('no node definition')
          return
        }
        const { definition } = nodeEntry
        const id = definition.id
        log.info('got an app def', id, !!definition)
        definitions[id] = definition
        packageIdToIdentifier[packageId] = id
      } catch (err) {
        log.error(`Error finding package definition: ${packageId}, message: ${err.message}`)
        log.error(err.stack)
      }
    }),
  )

  return {
    definitions,
    packageIdToIdentifier,
  }
}

export function requireAppNodeEntry(
  directory: string,
): { type: 'success'; definition: AppDefinition } | { type: 'error'; message: string } {
  const nodeEntryPath = join(directory, 'dist', 'index.node.js')
  log.info(`Importing entry ${nodeEntryPath}`)
  const nodeEntry = require(nodeEntryPath)
  if (!nodeEntry || !nodeEntry.default) {
    log.info(`App must \`export default\` an AppDefinition, got ${typeof nodeEntry}`)
    return {
      type: 'error' as const,
      message: `No node entry found`,
    }
  }
  return {
    type: 'success' as const,
    definition: nodeEntry.default,
  }
}
