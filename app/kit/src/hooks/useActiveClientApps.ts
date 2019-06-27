import { AppBit } from '@o/models'
import { appDefinesClient } from '../helpers/appDefinesClient'
import { useActiveApps, FindBitWhere } from './useActiveApps'

export function useActiveClientApps(where?: FindBitWhere): AppBit[] {
  return useActiveApps(where).filter(appDefinesClient)
}
