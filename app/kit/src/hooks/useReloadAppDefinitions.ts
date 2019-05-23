import { useForceUpdate } from '@o/use-store'
import { useEffect } from 'react'

let listeners = new Map<number, Function>()

// used only from orbit-app to refresh appdefinition hooks in kit

export function useReloadAppDefinitions() {
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    const id = Math.random()
    listeners.set(id, forceUpdate)
    return () => {
      listeners.delete(id)
    }
  }, [])
}

export function reloadAppDefinitions() {
  for (const [, listener] of listeners.entries()) {
    listener()
  }
}
