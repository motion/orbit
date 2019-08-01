import { readPackageJson } from './readPackageJson'

export const isOrbitApp = async (rootDir: string) => {
  const pkg = await readPackageJson(rootDir)
  return pkg && pkg.config && pkg.config.orbitApp === true
}
