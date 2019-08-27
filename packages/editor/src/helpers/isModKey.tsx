/**
 * Detect Cmd or Ctrl by platform for keyboard shortcuts
 */
export function isModKey(event: React.KeyboardEvent) {
  const isMac =
    typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
  return isMac ? event.metaKey : event.ctrlKey
}
