import { AppDefinition, Logger } from '@o/kit'
import { Space } from '@o/models'
import { join } from 'path'

import { getWorkspaceAppMeta } from './getWorkspaceAppMeta'

type AppDefinitions = { [id: string]: AppDefinition }

const log = new Logger('readWorkspaceAppDefs')

export async function getWorkspaceAppDefs(
  space: Space,
): Promise<{
  definitions: AppDefinitions | null
  identifierToPackageId: { [key: string]: string }
}> {
  const appsMeta = await getWorkspaceAppMeta(space)

  const definitions: AppDefinitions = {}
  const identifierToPackageId = {}

  await Promise.all(
    appsMeta.map(async ({ packageId, directory }) => {
      try {
        const nodeEntryPath = join(directory, 'dist', 'index.node.js')
        log.info(`Importing entry ${nodeEntryPath}`)
        const nodeEntry = require(nodeEntryPath)
        if (!nodeEntry || !nodeEntry.default) {
          log.info(`App must \`export default\` an AppDefinition, got ${typeof nodeEntry}`)
          return
        }
        const id = nodeEntry.default.id
        log.info('got an app def', id, !!nodeEntry.default)
        definitions[id] = nodeEntry.default
        identifierToPackageId[id] = packageId
      } catch (err) {
        log.error(`Error finding package definition: ${packageId}, message: ${err.message}`)
        log.error(err.stack)
      }
    }),
  )

  return {
    definitions,
    identifierToPackageId,
  }
}
