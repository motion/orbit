import { AppDefinition } from '@o/models'
import { join } from 'path'

import { reporter } from '../reporter'
import { identifierToPackageId } from './getPackageId'

export async function requireAppDefinition({
  directory,
  packageId,
}: {
  directory: string
  packageId: string
}) {
  const appPath = join(directory, 'node_modules', ...packageId.split('/'))

  // load full web app for validation
  const appDefPath = join(appPath, 'dist', 'index.js')

  reporter.info(`Importing app definition at ${appDefPath}`)

  let definition: AppDefinition

  try {
    definition = require(appDefPath).default

    // update cache
    identifierToPackageId[definition.id] = packageId
  } catch (err) {
    console.log('error with app def', err)
    return {
      type: 'error' as const,
      message: `${err.message}`,
    }
  }

  reporter.info(`got def ${definition.name}`)

  return {
    type: 'success' as const,
    definition,
  }
}
