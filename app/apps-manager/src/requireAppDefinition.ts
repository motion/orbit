import { Logger } from '@o/logger'
import { AppDefinition } from '@o/models'

import { findPackage } from './findPackage'
import { setIdentifierToPackageId } from './getPackageId'
import { loadAppEntry } from './loadAppEntry'

const log = new Logger('requireAppDefinition')

export async function requireAppDefinition({
  directory,
  packageId,
  types,
}: {
  directory: string
  packageId: string
  types: ('node' | 'web' | 'appInfo')[]
}) {
  if (!directory || !packageId) {
    return {
      type: 'error' as const,
      message: `No directory/packageId given`,
    }
  }

  const packageRoot = await findPackage({ packageId, directory })

  if (!packageRoot) {
    return {
      type: 'error' as const,
      message: `No package found (packageId: ${packageId}, directory: ${directory})`,
    }
  }

  log.verbose(`Importing app definition at appRoot ${packageRoot}`)

  // can specify preferred definition
  let definition: AppDefinition | null = null
  for (const type of types) {
    definition = await loadAppEntry(packageRoot, type)
    if (definition) break
  }

  if (definition) {
    log.verbose(`got def ${definition.name}`)
    // update cache
    setIdentifierToPackageId(definition.id, packageId)
    return {
      type: 'success',
      value: definition,
    } as const
  }

  return {
    type: 'error',
    message: 'No definition found',
  } as const
}
