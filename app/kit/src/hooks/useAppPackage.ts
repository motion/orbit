import { config } from '../configureKit'

export function useAppPackage(id: string) {
  return config.getApps().find(x => x.id === id)
}
