import { KitStores } from '@mcro/kit'
import { UIStores } from '@mcro/ui'
import { AppsStore } from './AppsStore'
import { SourcesStore } from './SourcesStore'

export type AppsStores = UIStores &
  KitStores & {
    sourcesStore?: SourcesStore
    appsStore?: AppsStore
  }

export * from './AppsStore'
export * from './SourcesStore'
