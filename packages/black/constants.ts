export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_ELECTRON = isElectron()

function isElectron() {
  if (
    typeof window !== 'undefined' &&
    // @ts-ignore
    window.process &&
    // @ts-ignore
    window.process.type === 'renderer'
  ) {
    return true
  }
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    // @ts-ignore
    !!process.versions.electron
  ) {
    return true
  }
  return false
}
