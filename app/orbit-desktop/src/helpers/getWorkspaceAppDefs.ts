import { Logger } from '@o/logger'
import { AppDefinition, Space } from '@o/models'
import { pathExists } from 'fs-extra'
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
        const nodeEntry = await requireAppEntry(join(directory, 'dist', 'index.node.js'))
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

export async function requireAppEntry(
  entryPath: string,
): Promise<{ type: 'success'; definition: AppDefinition } | { type: 'error'; message: string }> {
  let nodeEntry
  log.info(`Importing entry ${entryPath}`)
  try {
    if (!(await pathExists(entryPath))) {
      return {
        type: 'error' as const,
        message: 'No entry file',
      }
    }
    nodeEntry = require(entryPath)
    if (!nodeEntry || !nodeEntry.default) {
      log.info(`App must \`export default\` an AppDefinition, got ${typeof nodeEntry}`)
      return {
        type: 'error' as const,
        message: `No export default found on node entry.`,
      }
    }
  } catch (err) {
    return {
      type: 'error' as const,
      message: `Error requiring entry ${err.message} ${err.stack}`,
    }
  }
  return {
    type: 'success' as const,
    definition: nodeEntry.default,
  }
}
