import { DesktopActions } from '@o/stores'
import { ensureDir, pathExists } from 'fs-extra'

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

  await ensureDir(path)
  await ensureDir(orbitParentDir)
  await setupSubDirectories(subDirectories)

  return true
}

async function setupSubDirectories(subDirectories: string[]) {
  try {
    await Promise.all(subDirectories.map(dir => ensureDir(dir)))
  } catch (err) {
    console.error(err)
    return false
  }

  return true
}
