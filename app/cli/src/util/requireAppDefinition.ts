import { reporter } from '../reporter'
import { findPackage } from './findPackage'
import { setIdentifierToPackageId } from './getPackageId'
import { loadAppEntry } from './loadAppEntry'
import { AppDefinition } from '@o/models'

export async function requireAppDefinition({
  directory,
  packageId,
  types,
}: {
  directory: string
  packageId: string
  types: ('node' | 'web')[]
}) {
  if (!directory || !packageId) {
    return {
      type: 'error' as const,
      message: `No directory/packageId given`,
    }
  }

  const packageRoot = findPackage({ packageId, directory })

  if (!packageRoot) {
    return {
      type: 'error' as const,
      message: `No package found (packageId: ${packageId}, directory: ${directory})`,
    }
  }

  reporter.info(`Importing app definition at appRoot ${packageRoot}`)

  // can specify preferred definition
  let definition: AppDefinition | null = null
  for (const type of types) {
    definition = await loadAppEntry(packageRoot, type)
    if (definition) break
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
