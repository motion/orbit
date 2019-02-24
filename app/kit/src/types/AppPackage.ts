import { AppBit } from '@mcro/models'
import { AppDefinition } from './AppDefinition'

export type AppModule = {
  app: AppDefinition
  context?: React.Context<any>
  API?: {
    recieve(app: AppBit, parentID: number, child: any): any
  }
}

export type AppPackage = AppModule & {
  id: string
}
