import { AppBit } from '@mcro/models'
import { appDefinesClient } from '../helpers/appDefinesClient'
import { useActiveApps } from './useActiveApps'

export function useActiveClientApps(type?: string): AppBit[] {
  return useActiveApps(type).filter(appDefinesClient)
}
