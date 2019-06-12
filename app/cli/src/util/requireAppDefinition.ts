import { reporter } from '../reporter'
import { findPackage } from './findPackage'
import { setIdentifierToPackageId } from './getPackageId'
import { loadAppEntry } from './loadAppEntry'

export async function requireAppDefinition({
  directory,
  packageId,
}: {
  directory: string
  packageId: string
}) {
  const packageRoot = findPackage({ packageId, directory })
  reporter.info(`Importing app definition at appRoot ${packageRoot}`)

  // try web, then node, for now...
  let definition = await loadAppEntry(packageRoot, 'web')
  if (!definition) {
    definition = await loadAppEntry(packageRoot, 'node')
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
