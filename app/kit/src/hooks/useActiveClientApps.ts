import { AppBit } from '@o/models'
import { appDefinesClient } from '../helpers/appDefinesClient'
import { useActiveApps } from './useActiveApps'
import { FindOptions } from 'typeorm'

export function useActiveClientApps(where?: FindOptions<AppBit>['where']): AppBit[] {
  return useActiveApps(where).filter(appDefinesClient)
}
