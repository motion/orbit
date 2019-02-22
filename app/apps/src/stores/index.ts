import { KitStores } from '@mcro/kit'
import { UIStores } from '@mcro/ui'
import { SourcesStore } from './SourcesStore'

export type AppsStores = UIStores &
  KitStores & {
    sourcesStore?: SourcesStore
  }

export * from './SourcesStore'
