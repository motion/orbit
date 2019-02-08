import { DesktopActions } from '@mcro/stores'
import { mkdir, pathExists } from 'fs-extra'

// ensures we have a ~/.orbit like directory
export async function ensureHomeDir(
  path: string,
  orbitParentDir: string,
  subDirectories: string[],
) {
  if (await pathExists(path)) {
    // already have a home! lets ensure its the right one
    if (await pathExists(orbitParentDir)) {
      // setup any new subDirectories if we need them
      return await setupSubDirectories(subDirectories)
    }

    // they have home dir, but missing sub-dirs, weird
    DesktopActions.error.setError({
      title: 'Missing sub-directories in your orbit directory',
      message: `Expected ${subDirectories.join(', ')} inside ${path}.`,
      type: 'error',
    })
    return false
  }

  let success = await ensureDir(orbitParentDir)
  if (!success) return false

  success = await ensureDir(path)
  if (!success) return false

  success = await setupSubDirectories(subDirectories)
  if (!success) return false

  return true
}

// sets up a new ~/.orbit like directory
async function ensureDir(path: string) {
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
