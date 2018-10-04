import { getGlobalConfig } from '@mcro/config'
import { readJSON } from 'fs-extra'
import semver from 'semver'

console.log('Orbit config at', getGlobalConfig().paths.orbitConfig)

export const getConfig = () => readJSON(getGlobalConfig().paths.orbitConfig)
export const getConfigAttr = key => getConfig().then(config => config[key])
export const getOrbitVersion = () => getConfigAttr('version')
export const ensureOrbitVersionGreaterThan = async version => {
  const orbitVersion = await getOrbitVersion()
  if (!orbitVersion) {
    return false
  }
  return semver(orbitVersion).gt(version)
}
