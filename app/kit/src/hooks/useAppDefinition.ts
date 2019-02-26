import { config } from '../configureKit'

export function useAppDefinition(id: string) {
  return config.getApps().find(x => x.id === id)
}
