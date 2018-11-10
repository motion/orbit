import { AppType } from '@mcro/models'
import { AppProps } from './AppProps'
import { GenericComponent } from '../types'
import { lists } from './lists'
import { topics } from './topics'
import { people } from './people/people'
import { search } from './search'
import { source } from './source'
import { bit } from './bit'

type App = {
  index: GenericComponent<AppProps>
  main: GenericComponent<AppProps>
}

type AppsIndex = { [key in AppType]: App }

export const apps: AppsIndex = {
  search,
  people,
  topics,
  lists,
  source,
  bit,
}
