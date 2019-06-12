import { join } from 'path'

import { reporter } from '../reporter'
import { setIdentifierToPackageId } from './getPackageId'
import { loadAppEntry } from './loadAppEntry'

export async function requireAppDefinition({
  directory,
  packageId,
}: {
  directory: string
  packageId: string
}) {
  const appRoot = join(directory, 'node_modules', ...packageId.split('/'))
  reporter.info(`Importing app definition at appRoot ${appRoot}`)

  // try web, then node, for now...
  let definition = await loadAppEntry(appRoot, 'web')
  if (!definition) {
    definition = await loadAppEntry(appRoot, 'node')
  }

  if (definition) {
    reporter.info(`got def ${definition.name}`)
    // update cache
    setIdentifierToPackageId(definition.id, packageId)
    return {
      type: 'success' as const,
      definition,
    }
  }

  return {
    type: 'error' as const,
    message: 'No definition found',
  }
}
