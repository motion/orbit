import { AppConfig, AppStore } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { FunctionComponent } from 'react'

type AppBitOf<A> = AppBit & { data: A }

export interface App<A> extends FunctionComponent<AppProps> {
  defaultValue: A
  api: {
    receive(bit: AppBitOf<A>, ...args: any[]): any
  }
}

export type AppProps = {
  appConfig?: AppConfig
  id?: string
  viewType?: 'index' | 'main' | 'setup' | 'settings' | 'toolBar' | 'statusBar'
  title?: string
  appStore: AppStore
  isActive?: boolean | (() => boolean)
}
