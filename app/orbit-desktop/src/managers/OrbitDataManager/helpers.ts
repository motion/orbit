import { DesktopActions } from '@mcro/stores'
import { mkdir, pathExists } from 'fs-extra'
import { join } from 'path'

// ensures we have a ~/.orbit like directory
export async function ensureHomeDir(path: string, subDirectories: string[]) {
  if (await pathExists(path)) {
    const hasConfig = await pathExists(join(path, 'orbitConfig.json'))

    if (hasConfig) {
      return true
    }

    // if they have the directory but no config file, show error
    DesktopActions.error.setError({
      title: 'Could not find orbitConfig.json in your orbit directory',
      message: `You may have moved or deleted the config, or moved your orbit home directory.`,
      type: 'error',
    })
    return false
  }

  let success = false

  success = await instantiateHomeDir(path)
  if (!success) return

  success = await setupSubDirectories(subDirectories)
  if (!success) return

  return true
}

// sets up a new ~/.orbit like directory
async function instantiateHomeDir(path: string) {
  try {
    await mkdir(path)
  } catch (err) {
    // permissions or some other problem
    DesktopActions.error.setError({
      title: 'Error creating orbit home directory',
      message: `May be permissions or conflicting files: ${err.message}.`,
      type: 'error',
    })
    return false
  }

  return true
}

async function setupSubDirectories(subDirectories: string[]) {
  try {
    await Promise.all(subDirectories.map(dir => mkdir(dir)))
  } catch (err) {
    console.error(err)
    return false
  }

  return true
}
