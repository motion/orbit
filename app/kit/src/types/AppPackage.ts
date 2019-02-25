import { AppBit } from '@mcro/models'
import { AppDefinition } from './AppDefinition'

export type AppPackage = {
  id: string
  app: AppDefinition
  context?: React.Context<any>
  API?: {
    receive(app: AppBit, parentID: number, child: any): any
  }
}
