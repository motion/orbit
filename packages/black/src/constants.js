// @flow
export const IS_PROD = process.env.NODE_ENV === '"production"'
export const IS_ELECTRON = isElectron()

function isElectron(): boolean {
  if (
    typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
  ) {
    return true
  }
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    !!process.versions.electron
  ) {
    return true
  }
  return false
}
