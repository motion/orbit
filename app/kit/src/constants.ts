export const IS_ELECTRON = isElectron()

function isElectron() {
  // Main process
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions['electron']
  ) {
    return true
  }

  return false
}
